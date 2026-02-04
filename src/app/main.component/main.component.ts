// (Import คงเดิม ไม่ต้องแก้)
import { Component, OnInit, ViewChild, ChangeDetectorRef, TemplateRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { SidebarComponent, MenuName } from '../sidebar/sidebar.component';
import { DataService } from '../services/data.service';
import { DisplayUser } from '../models/user.model';
import { ThaiDatePipe } from '../pipes/thai-date.pipe';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import moment from 'moment'; 
import { Router, ActivatedRoute } from '@angular/router';

// Material Modules
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
import { MatSelectModule } from '@angular/material/select'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatTabsModule } from '@angular/material/tabs';

import { NgApexchartsModule } from "ng-apexcharts"; 
import { ChatComponent } from '../chat.component/chat.component';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexPlotOptions,
  ApexFill,
  ApexDataLabels,
  ApexTooltip
} from "ng-apexcharts";

import { UserDetailDialogComponent } from '../main.component/user-detail-dialog.component'; 

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  dataLabels: ApexDataLabels; 
  colors: string[];
  tooltip: ApexTooltip;
};

export const MY_DASHBOARD_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule, 
    SidebarComponent, 
    ThaiDatePipe,
    ReactiveFormsModule, 
    FormsModule,         
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,    
    MatTooltipModule,
    MatDatepickerModule, 
    MatFormFieldModule,  
    MatInputModule,      
    MatMomentDateModule,
    MatDialogModule, 
    MatSnackBarModule,
    NgApexchartsModule,
    MatSelectModule, 
    MatButtonModule,
    MatTabsModule,
    ChatComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'th-TH' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DASHBOARD_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } } 
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit { 
  activeMenu: MenuName = (sessionStorage.getItem('last_active_menu') as MenuName) || 'Dashboard';
  username: string = 'Guest';
  role: string = 'User';

  dataSource = new MatTableDataSource<DisplayUser>([]);
  displayedColumns: string[] = ['id', 'avatar', 'name', 'birthDate', 'age', 'role', 'email' ,'action'];
  isLoading = true;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    if (mp) this.dataSource.paginator = mp;
  }
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    if (ms) this.dataSource.sort = ms;
  }
  
  @ViewChild('warningDialog') warningDialogTemplate!: TemplateRef<any>;
  dialogTitle: string = '';
  dialogMessage: string = '';

  countries: any[] = [];
  selectedCountry: string = 'ABW';
  
  wbStartYear: number = 2011;
  wbEndYear: number = 2024;
  isWorldBankLoading: boolean = false;

  public lineChartOptions: Partial<ChartOptions> = { 
    series: [], chart: { type: 'line', height: 350 } 
  };
  public columnChartOptions: Partial<ChartOptions> = { 
    series: [], chart: { type: 'bar', height: 350 } 
  };

  weatherLat: number = 13.75; 
  weatherLon: number = 100.50; 
  isWeatherLoading: boolean = false; 

  public weatherChartOptions: Partial<ChartOptions> = { 
    series: [], chart: { type: 'area', height: 350 } 
  };

  weatherRange = new FormGroup({
    start: new FormControl<Date | null>(moment().subtract(7, 'days').toDate()),
    end: new FormControl<Date | null>(moment().add(7, 'days').toDate()),
  });

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('session_user') || 'Guest';
    this.role = sessionStorage.getItem('session_role') || 'User';

    const searchTerm = this.route.snapshot.queryParamMap.get('search');
    if (searchTerm) {
      this.dataSource.filter = searchTerm.trim().toLowerCase();
    }
    
    this.triggerApiByMenu(this.activeMenu);
  }

  triggerApiByMenu(menu: MenuName) {
    if (menu === 'Dashboard') {
      if (this.countries.length === 0) {
        this.loadWorldBankCountries();
      }
    } else if (menu === 'Data API') {
      if (this.dataSource.data.length === 0) {
        this.loadData();
      }
    }
  }
  
  loadData() { 
    this.isLoading = true; 
    this.dataService.getApiUsers().subscribe({
      next: (data) => {
        this.dataSource.data = data; 
        this.isLoading = false;
        setTimeout(() => {
          if (this.matPaginator) {
            this.dataSource.paginator = this.matPaginator;
            this.matPaginator.firstPage(); 
          }
        });
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
        this.snackBar.open('❌ เกิดข้อผิดพลาดในการโหลดข้อมูล!', 'ปิด', { duration: 5000 });
      }
    });
  }

  onMenuChange(menu: MenuName) { 
    this.activeMenu = menu;
    sessionStorage.setItem('last_active_menu', menu);
    this.triggerApiByMenu(menu);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: filterValue || null }, 
      queryParamsHandling: 'merge' 
    });
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // ---------------------------------------------------
  // 🌍 World Bank Logic
  // ---------------------------------------------------
  loadWorldBankCountries() {
    this.dataService.getWorldBankCountries().subscribe({
      next: (res: any) => {
        setTimeout(() => {
          this.countries = res;
          if (this.countries && this.countries.length > 0) {
            const firstCountryCode = this.countries[0].iso2Code;
            this.updateCharts(firstCountryCode);
          }
        }, 0);
      },
      error: (err) => {
        console.error('Failed to load countries', err);
      }
    });
  }

  updateCharts(countryCode: string) {
    this.selectedCountry = countryCode;
    this.isWorldBankLoading = true;
    
    this.dataService.getPopulationData(countryCode, this.wbStartYear, this.wbEndYear)
      .subscribe({
        next: (data) => {
          const validData = data || [];
          const years = validData.map((item: any) => item.date).reverse();
          const populations = validData.map((item: any) => item.value).reverse();
          const tooltipFormatter = {
            y: { formatter: (val: number) => val ? val.toLocaleString() : 'N/A' }
          };

          this.lineChartOptions = {
            series: [{ name: "Population", data: populations }],
            chart: { type: 'line', height: 350 },
            xaxis: { categories: years },
            title: { text: `Population Trend: ${countryCode} (${this.wbStartYear}-${this.wbEndYear})` },
            stroke: { curve: 'smooth', width: 3 },
            colors: ['#008FFB'],
            tooltip: tooltipFormatter,
          };

          this.columnChartOptions = {
            series: [{ name: "Population", data: populations }],
            chart: { type: 'bar', height: 350 },
            plotOptions: {
              bar: { horizontal: false, columnWidth: '50%', borderRadius: 4 }
            },
            xaxis: { categories: years },
            title: { text: `Distribution: ${countryCode}` },
            fill: { colors: ['#2c7873'] },
            dataLabels: { enabled: false },
            tooltip: tooltipFormatter,
          };
          
          setTimeout(() => {
            this.isWorldBankLoading = false;
            this.cdr.detectChanges();
          }, 0);
        },
        error: (err) => {
          setTimeout(() => {
            this.isWorldBankLoading = false;
            this.snackBar.open('Error loading data', 'Close');
            this.cdr.detectChanges();
          }, 0);
        }
      });
  }
  
  openEditDialog(row: DisplayUser) { 
    this.dialog.open(UserDetailDialogComponent, {
      width: '500px', data: row, autoFocus: false
    });
  }
  
  // ---------------------------------------------------
  // 🌤️ Weather API Logic
  // ---------------------------------------------------
  loadWeather() {
    if (this.weatherLat < -90 || this.weatherLat > 90 || 
        this.weatherLon < -180 || this.weatherLon > 180) {
      
      this.showWarning(
        'Invalid Coordinates', 
        'Please enter a valid Latitude (-90 to 90) <br> and Longitude (-180 to 180).'
      );
      return;
    }

    const start = this.weatherRange.value.start;
    const end = this.weatherRange.value.end;

    if (start && end) {
      const startDate = moment(start);
      const endDate = moment(end);
      const daysDiff = endDate.diff(startDate, 'days');

      if (daysDiff > 90) { 
         this.showWarning(
          'Date Range Too Large', 
          `You selected ${daysDiff} days. <br> Please select a range of <strong>90 days or less</strong>.`
        );
        return; 
      }

      this.isWeatherLoading = true;
      const startStr = startDate.format('YYYY-MM-DD');
      const endStr = endDate.format('YYYY-MM-DD');

      this.dataService.getWeatherData(this.weatherLat, this.weatherLon, startStr, endStr)
        .subscribe({
          next: (data) => {
            const daily = data.daily;
            this.weatherChartOptions = {
              series: [
                { name: "Max Temp (°C)", data: daily.temperature_2m_max },
                { name: "Min Temp (°C)", data: daily.temperature_2m_min }
              ],
              chart: { type: 'area', height: 350, toolbar: { show: false } },
              dataLabels: { enabled: false },
              stroke: { curve: 'smooth' },
              xaxis: { categories: daily.time, type: 'datetime' },
              title: { text: `Forecast: ${this.weatherLat}, ${this.weatherLon}`, align: 'left' },
              fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.9, stops: [0, 90, 100] }},
              colors: ['#ef4444', '#3b82f6'] 
            };

            setTimeout(() => {
              this.isWeatherLoading = false;
              this.cdr.detectChanges();
            }, 0);
          },
          error: (err) => {
            setTimeout(() => {
              this.isWeatherLoading = false;
              this.snackBar.open('Failed to load weather', 'Close');
              this.cdr.detectChanges();
            }, 0);
          }
        });
    }
  }

  showWarning(title: string, message: string) {
    this.dialogTitle = title;
    this.dialogMessage = message;
    this.dialog.open(this.warningDialogTemplate, { width: '400px' });
  }
  
  onTabChange(event: any) {
    if (event.index === 1 && this.weatherChartOptions.series?.length === 0) {
      this.loadWeather();
    }
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }
}