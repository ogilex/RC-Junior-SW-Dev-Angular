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
        //this.createChart();
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
      
      let hourDuration = Math.round(duration.valueOf() / 3600000);
      this.hashMap.set(empName, hourDuration);
      let emp: EmployeeView = {
        EmployeeName: empName,
        HourDuration: hourDuration
      };
      this.employeesView.push(emp);
    })

    this.employeesView = this.employeesView.sort((a, b) => b.HourDuration.valueOf() - a.HourDuration.valueOf());

  }

}
