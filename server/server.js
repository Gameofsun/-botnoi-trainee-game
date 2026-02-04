const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// 1. อนุญาต HTTP Request จากทุกที่
app.use(cors());

// 2. สร้างหน้า Home Page (Route '/') เพื่อให้ตรวจสอบผ่าน Browser ได้ง่ายๆ
// เวลาเข้า http://192.168.1.41:3000 จะได้ไม่เจอ Error 404
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: 'Segoe UI', sans-serif; text-align: center; padding-top: 50px; color: #333;">
      <h1 style="color: #2c7873;">✅ Chat Server is Running!</h1>
      <p style="font-size: 18px;">Status: <strong>Online</strong></p>
      <p>Listening on Port: <strong>3000</strong></p>
      <hr style="width: 200px; margin: 20px auto;">
      <p style="color: #666; font-size: 14px;">พร้อมรับการเชื่อมต่อจาก Angular แล้ว</p>
    </div>
  `);
});

const server = http.createServer(app);

// 3. ตั้งค่า Socket.io
const io = new Server(server, {
  cors: {
    // 🔴 จุดสำคัญ: ใส่ "*" เพื่ออนุญาตให้เครื่องอื่น (มือถือ/คอมเพื่อน) เชื่อมต่อได้
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('⚡ มีผู้ใช้เชื่อมต่อ ID: ' + socket.id);

  // เมื่อได้รับข้อความจาก Client (เช่น จาก Angular)
  socket.on('chat-message', (data) => {
    console.log('📩 ได้รับข้อความ:', data);
    
    // ส่งข้อความกระจายไปให้ "คนอื่นทุกคน" (Broadcast)
    // (คนส่งจะไม่ได้รับข้อความตัวเองกลับมา เพื่อไม่ให้ข้อความซ้ำ)
    socket.broadcast.emit('chat-message', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ ผู้ใช้ตัดการเชื่อมต่อ: ' + socket.id);
  });
});

const PORT = 3000;

// 4. สั่งให้ Server ฟังที่ '0.0.0.0' 
// เพื่อให้เครื่องอื่นในวงแลนมองเห็น Server นี้ผ่าน IP Address ได้
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server กำลังทำงาน...`);
  console.log(`   - Local:   http://localhost:${PORT}`);
  console.log(`   - Network: http://<เลข_IP_เครื่องคุณ>:${PORT}`);
});