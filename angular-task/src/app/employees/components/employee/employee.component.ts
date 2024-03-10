import { Component, OnInit } from '@angular/core';
import type { Employee, EmployeeView } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit{

  chart: any;
  employeeList: Employee[] = [];
  hashMap = new Map<string, number>();
  employeesView: EmployeeView[] = [];
  randomBackgroundColor: string[] = [];
  usedColors: Set<string> = new Set();
  constructor(private employeeService: EmployeeService) {};

  ngOnInit(): void {
    this.getAllEmployees();
    
  }

  getAllEmployees(){
    this.employeeService.getEmployees().subscribe(
      response => {
        this.employeeList = response;
        this.calculateWorkTimeForEmployees();
        this.createChart();
      }
    )
  }

  calculateWorkTimeForEmployees(){
    this.employeeList.forEach(emp => {
      if(emp.EmployeeName != null){
      let workStart = new Date(emp.StarTimeUtc.valueOf());
      let workEnd = new Date(emp.EndTimeUtc.valueOf());
      let duration = (workEnd.valueOf() - workStart.valueOf());
      if(duration >= 0){
        let oldDuration = this.hashMap.get(emp.EmployeeName);
        if(oldDuration != null){
          this.hashMap.set(emp.EmployeeName, duration + oldDuration.valueOf());
        }else{
          this.hashMap.set(emp.EmployeeName, duration);
        }
      }
    }
    })
    
    this.hashMap.forEach((duration, empName) => {
      
      let hourDuration = Math.trunc(duration.valueOf() / 3600000);
      this.hashMap.set(empName, hourDuration);
      let emp: EmployeeView = {
        EmployeeName: empName,
        HourDuration: hourDuration
      };
      this.employeesView.push(emp);
    })

    this.employeesView = this.employeesView.sort((a, b) => b.HourDuration.valueOf() - a.HourDuration.valueOf());

  }

  createChart(){
    let emplyeeNames = Array.from(this.hashMap.keys());
    let employeeHours = Array.from(this.hashMap.values());
    let dynamicColors = (): string => {
      let h: number = Math.floor(Math.random() * 360);
      let s: number = Math.floor(Math.random() * 20) + 80;
      let l: number = Math.floor(Math.random() * 20) + 60;
      let rgbColor: string = `hsl(${h},${s}%,${l}%)`;
  
      if (!this.usedColors.has(rgbColor)) {
          this.usedColors.add(rgbColor);
          return rgbColor;
      } else {
          return dynamicColors();
      }
  };
  
  for (let _i in employeeHours) {
    this.randomBackgroundColor.push(dynamicColors());
  }
    this.chart = new Chart("myChart",{
      type: 'pie',
      data: {
        labels: emplyeeNames,
          datasets: [{
            label: 'Hours Worked',
            data: employeeHours,
            backgroundColor: this.randomBackgroundColor
          }]
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            formatter: ((value: any, context: any) => {
              let datapoints = context.chart.data.datasets[0].data;
              function totalSum(total: any, dadapoint: any) {
                return total + dadapoint;
              }
              let totalValue = datapoints.reduce(totalSum, 0);
              let percentageValue = (value / totalValue * 100).toFixed(0);
              return `${percentageValue}%`;
            }),
            color: '#000000'
          },  
          legend: {
            display: true,
            position: 'bottom'
          }
          
        }
      },
      plugins: [ChartDataLabels]
    })
  }

}


