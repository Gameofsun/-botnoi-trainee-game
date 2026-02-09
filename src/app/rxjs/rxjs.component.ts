import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  Observable, BehaviorSubject, of, interval, throwError, fromEvent, 
  concat, merge, forkJoin, combineLatest, Subscription, Subject, timer 
} from 'rxjs';
import { 
  map, filter, take, debounceTime, catchError, switchMap, 
  delay, repeat, tap, distinctUntilChanged, scan, mergeMap, concatMap
} from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.css']
})
export class RxjsComponent implements OnInit, AfterViewInit, OnDestroy {
  logs: string[] = [];
  private subs = new Subscription();

  // --- 1. BehaviorSubject Variables ---
  status$ = new BehaviorSubject<string>('Offline');

  // --- 14. CombineLatest Variables ---
  color$ = new BehaviorSubject<string>('แดง');
  size$ = new BehaviorSubject<string>('M');

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    // 1. Subscribe BehaviorSubject เพื่อโชว์ค่าปัจจุบันเสมอ
    this.subs.add(
      this.status$.subscribe(val => this.log(`[1] สถานะปัจจุบัน: ${val}`))
    );

    // 14. CombineLatest Setup
    this.subs.add(
      combineLatest([this.color$, this.size$]).subscribe(([c, s]) => {
        // Log นี้จะทำงานก็ต่อเมื่อมีการกดเปลี่ยนค่า Color หรือ Size
        // this.log(`[14] สินค้าที่เลือก: สี${c} - ไซส์ ${s}`); 
      })
    );
  }

  ngAfterViewInit() {
    // Setup สำหรับข้อ 5, 6, 12, 13 (Search Box)
    const search$ = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      map((e: any) => e.target.value),
      debounceTime(500),          // 5. DebounceTime
      distinctUntilChanged(),     // 13. DistinctUntilChanged
      tap(val => this.log(`[12] Tap: กำลังส่งค่า "${val}" ไป API...`)), // 12. Tap
      switchMap(val => this.mockApi(val)) // 6. SwitchMap
    );

    this.subs.add(search$.subscribe(res => this.log(`✅ ผลลัพธ์: ${res}`)));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  // ==================================================
  // รวมฟังก์ชันเทส 1-14
  // ==================================================

  // 1. BehaviorSubject ***
  testBehaviorSubject(status: string) {
    this.status$.next(status);
  }

  // 2. Observable ***
  testObservable() {
    this.log('--- เริ่มข้อ 2 Observable ---');
    const obs = new Observable(sub => {
      sub.next('ค่าที่ 1');
      sub.next('ค่าที่ 2');
      setTimeout(() => {
        sub.next('ค่าที่ 3 (มาสาย)');
        sub.complete();
      }, 1000);
    });

    obs.subscribe({
      next: v => this.log(`[2] ได้รับ: ${v}`),
      complete: () => this.log('[2] จบการทำงาน (Complete)')
    });
  }

  // 3. Pipe & Map
  testPipeMap() {
    this.log('--- เริ่มข้อ 3 Pipe & Map ---');
    of(1, 2, 3, 4, 5).pipe(
      map(x => x * 10), // คูณ 10
      map(x => `ราคา ${x} บาท`) // แปลงเป็น string
    ).subscribe(val => this.log(`[3] ${val}`));
  }

  // 4. Filter & Take
  testFilterTake() {
    this.log('--- เริ่มข้อ 4 Filter & Take ---');
    interval(200).pipe(
      filter(x => x % 2 !== 0), // เอาเลขคี่
      take(3) // เอาแค่ 3 ตัว
    ).subscribe(val => this.log(`[4] เลขคี่: ${val}`));
  }

  // 5. DebounceTime (Simulation)
  testDebounce() {
    this.log('--- เริ่มข้อ 5 จำลองการรัวปุ่ม (Debounce 1s) ---');
    const clicks$ = new Subject<string>();
    
    clicks$.pipe(debounceTime(1000)).subscribe(v => this.log(`[5] ✅ รับค่าสุดท้าย: ${v}`));

    this.log('Click 1...'); clicks$.next('A');
    setTimeout(() => { this.log('Click 2...'); clicks$.next('AB'); }, 200);
    setTimeout(() => { this.log('Click 3...'); clicks$.next('ABC'); }, 500);
    // จะ log แค่ "ABC" หลังหยุดคลิก 1 วิ
  }

  // 6. SwitchMap (Simulation)
  testSwitchMap() {
    this.log('--- เริ่มข้อ 6 SwitchMap ---');
    // สมมติมีการกดปุ่มขอข้อมูลซ้ำๆ SwitchMap จะยกเลิกอันเก่า
    of('Request 1').pipe(delay(500)).subscribe(v => this.log(`(ถ้าไม่ใช้ SwitchMap) ${v}`)); 
    
    // แบบ SwitchMap (จำลองด้วย Timer)
    timer(0, 300).pipe(
      take(3),
      tap(i => this.log(`[6] ส่ง Request ${i+1}...`)),
      switchMap(i => of(`✅ Data ${i+1} มาแล้ว`).pipe(delay(1000))) // ตอบกลับช้ากว่า request ถัดไป
    ).subscribe(val => this.log(val));
    // ผล: จะได้ Data 3 ตัวเดียว เพราะ 1 กับ 2 โดนยกเลิกก่อนตอบกลับ
  }

  // 7. Catch Error
  testCatchError() {
    this.log('--- เริ่มข้อ 7 Catch Error ---');
    throwError(() => '🔥 ไฟไหม้เซิฟเวอร์!').pipe(
      catchError(err => {
        this.log(`[7] จับ Error ได้: "${err}"`);
        return of('🧯 ถังดับเพลิง (ค่าสำรอง)');
      })
    ).subscribe(val => this.log(`[7] ได้รับ: ${val}`));
  }

  // 8. Interval & Repeat
  testIntervalRepeat() {
    this.log('--- เริ่มข้อ 8 Interval & Repeat ---');
    of('ดริ๊ง!').pipe(
      delay(500),
      repeat(3)
    ).subscribe(val => this.log(`[8] ${val}`));
  }

  // 9. Concat & Merge
  testConcatMerge() {
    const s1$ = of('A (เร็ว)').pipe(delay(500));
    const s2$ = of('B (ช้า)').pipe(delay(1500));

    this.log('--- เริ่มข้อ 9 Merge (ใครเสร็จก่อนโชว์ก่อน) ---');
    merge(s1$, s2$).subscribe(v => this.log(`[9 Merge] ${v}`));

    setTimeout(() => {
        this.log('--- เริ่มข้อ 9 Concat (รอคิว) ---');
        concat(s1$, s2$).subscribe(v => this.log(`[9 Concat] ${v}`));
    }, 3000);
  }

  // 10. ForkJoin
  testForkJoin() {
    this.log('--- เริ่มข้อ 10 ForkJoin (รอครบทุกตัว) ---');
    const req1 = of('User').pipe(delay(1000));
    const req2 = of('Product').pipe(delay(500));
    const req3 = of('Order').pipe(delay(1500));

    forkJoin([req1, req2, req3]).subscribe(res => {
      this.log(`[10] จบงานพร้อมกัน ได้ผลลัพธ์: ${JSON.stringify(res)}`);
    });
  }

  // 11. Delay
  testDelay() {
    this.log('--- เริ่มข้อ 11 Delay ---');
    this.log('[11] เริ่มนับ 2 วินาที...');
    of('ครบ 2 วินาทีแล้วจ้า').pipe(delay(2000)).subscribe(v => this.log(`[11] ${v}`));
  }

  // 12. Tap
  testTap() {
    this.log('--- เริ่มข้อ 12 Tap (แอบดูข้อมูล) ---');
    of(5, 10).pipe(
      tap(v => this.log(`[12] Tap เห็นค่า: ${v}`)),
      map(v => v * v)
    ).subscribe(v => this.log(`[12] ปลายทางได้รับ: ${v}`));
  }

  // 13. DistinctUntilChanged
  testDistinct() {
    this.log('--- เริ่มข้อ 13 DistinctUntilChanged ---');
    of(1, 1, 2, 2, 2, 3, 1).pipe(
      distinctUntilChanged()
    ).subscribe(v => this.log(`[13] ค่าที่ผ่าน: ${v}`));
  }

  // 14. CombineLatest
  updateColor(c: string) { this.color$.next(c); this.checkCombine(); }
  updateSize(s: string) { this.size$.next(s); this.checkCombine(); }
  
  checkCombine() {
    // เรียก manual subscribe เพื่อโชว์ log ในปุ่ม
    this.log(`[14] CombineLatest: สี=${this.color$.value}, ไซส์=${this.size$.value}`);
  }

  // Mock API
  mockApi(val: string) {
    return of(`ผลการค้นหา "${val}"`).pipe(delay(800));
  }

  // Helper
  log(msg: string) {
    this.logs.unshift(`${new Date().toLocaleTimeString()} : ${msg}`);
    if (this.logs.length > 25) this.logs.pop();
  }
  
  clearLogs() {
    this.logs = [];
  }
}