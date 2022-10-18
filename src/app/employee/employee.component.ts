
import { Component, OnInit } from '@angular/core';  
import { EmployeeService } from '../shared/services/employee.service';  
import { LookupService } from '../shared/services/lookup.service';  
import { FormGroup, FormControl,Validators, FormBuilder, FormArray } from '@angular/forms';   
import { Router } from '@angular/router';
import { Department, Dependent, EmployeeAttachment, EmployeeDto, Position, SalaryDetail } from '../_interfaces/EmployeeDto.model';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  
  title = 'EmployeeFrontEnd';  
  errorMessage: any;
  showError: boolean;
     
  constructor(private EmployeeService: EmployeeService, private router: Router, 
    private LookupService: LookupService, private fb:FormBuilder) { }  
  data: any;  
  EmpForm: any;  
  submitted = false;   
  EventValue: any = "Save";  
  Departments: Array<Department>;
  Positions: Array<Position>;

  ngOnInit(): void { 
    this.getdepartments();
    this.getpositions();
    this.getdata(); 
    
    this.EmpForm = this.fb.group({  
      employeeId: [null],  
      fullName: ['', Validators.required],        
      identifierNumber: ['', Validators.required],  
      homeAddress:new FormControl(""),  
      birthDate: ['', Validators.required],
      joinDate: [null],  
      endDate: [null],  
      jobStatusId: [null],  
      departmentId : [null], 
      jobPositionId : [null], 
      employeeAttachments :this.fb.array([]), 
      dependents :this.fb.array([]), 
      salaryDetails :this.fb.array([]), 
    });   
  }  
  getdata() {  
    this.EmployeeService.getData()
    .subscribe({
      next: (res:any) => {
        this.data = res;
        for (let i = 0; i < this.data.length; i++) {
          this.data[i].departmentName = this.Departments.find((x: { id: number; }) => x.id === this.data[i].departmentId); 
          this.data[i].positionName = this.Positions.find((x: { id: number; }) => x.id === this.data[i].jobPositionId); 
        }
    },
    error: (err: HttpErrorResponse) => {
      debugger;
      this.errorMessage = err.message;
      this.showError = true;
    }}) 
  }  

  get dependentsControl() {
    return this.EmpForm.get('dependents') as FormArray;
  }

  deleteData(id:number) {  
    this.EmployeeService.deleteData(id).subscribe((data) => {
      this.data = data;  
      this.getdata();  
    })  
  }  
  Save() {  
    this.submitted = true;  
     if (this.EmpForm.invalid) {  
            return;  
     }  

    //  let model :any = {
    //   employeeId: this.EmpForm.get("employeeId"),
    //   fullName: this.EmpForm.get("fullName"),
    //   identifierNumber: this.EmpForm.get("identifierNumber"),
    //   homeAddress: this.EmpForm.get("homeAddress"),
    //   birthDate : this.EmpForm.get("birthDate"), 
    //   joinDate: this.EmpForm.get("joinDate"),
    //   endDate: this.EmpForm.get("endDate"),
    //   jobStatusId: this.EmpForm.get("jobStatusId"),
    //   departmentId: this.EmpForm.get("departmentId"),
    //   jobPositionId: this.EmpForm.get("jobPositionId"),
    //   Dependents: this.EmpForm.get("dependents"),
    //   EmployeeAttachments: this.EmpForm.get("employeeAttachments"),
    //   SalaryDetails: this.EmpForm.get("SalaryDetails")
    //  } ;

     if (this.EmpForm.value.employeeId != null) {  
      this.EmployeeService.putData(this.EmpForm.value).subscribe(
        {
          next: (data) => {
            debugger;
            this.data = data;  
            this.resetFrom();  
        },
        error: (err: HttpErrorResponse) => {
          debugger;
          this.errorMessage = err.message;
          this.showError = true;
        }}
      )    
    }  
    else  
    {
      //check if there added depdents or not
      if (this.dependentsControl.length > 0) {
       // add dependent 
      }
      

      this.EmployeeService.postData(this.EmpForm.value).subscribe((data: any) => { 
        debugger; 
        this.data = data;  
        this.resetFrom();  
      })  
    }
   
  }  
  
  Update() {   
    this.submitted = true;  
    if (this.EmpForm.invalid) {  
     return;  
    }        
    this.EmployeeService.putData(this.EmpForm.value).subscribe((data: any) => {  
      this.data = data;  
      this.resetFrom();  
    })  
  }  
  
  EditData(Data: any) {  
    debugger;
    this.EmpForm.controls["employeeId"].setValue(Data.employeeId);  
    this.EmpForm.controls["fullName"].setValue(Data.fullName);      
    this.EmpForm.controls["identifierNumber"].setValue(Data.identifierNumber);  
    this.EmpForm.controls["homeAddress"].setValue(Data.homeAddress);  
    this.EmpForm.controls["birthDate"].setValue(Data.birthDate);  
    this.EmpForm.controls["joinDate"].setValue(Data.joinDate);  
    this.EmpForm.controls["endDate"].setValue(Data.endDate);  
    this.EmpForm.controls["departmentId"].setValue(Data.departmentId);  
    this.EmpForm.controls["jobPositionId"].setValue(Data.jobPositionId);  
    this.EventValue = "Update";  
  }  
  
  resetFrom()  
  {     
    this.getdepartments();
    this.getpositions();
    this.getdata();   
    this.EmpForm.reset();  
    this.EventValue = "Save";  
    this.submitted = false;   
  } 
  
  getdepartments() {  
    this.LookupService.GetDepartments()
    .subscribe({
      next: (res:Department[]) => {
        this.Departments = res; 
    },
    error: (err: HttpErrorResponse) => {
      this.errorMessage = err.message;
      this.showError = true;
    }}) 
  } 

  getpositions() {  
    this.LookupService.GetPositions()
    .subscribe({
      next: (res:Position[]) => {
        this.Positions = res; 
    },
    error: (err: HttpErrorResponse) => {
      this.errorMessage = err.message;
      this.showError = true;
    }}) 
  } 

  GetPositionByDeptId(departmentId: number) {  
    this.LookupService.GetPositionByDeptId(departmentId).subscribe((data: Array<Position>) => { 
      debugger; 
      this.Positions = data;  
    })  
  }  

  changeDepartment(e: any) {
    // this.EmpForm.controls["departmentId"].setValue(e.target.value, {
    //   onlySelf: true,
    // });
    this.GetPositionByDeptId(this.EmpForm.controls["departmentId"].value);
  }

  changePosition(e: any) {
    this.EmpForm.controls["jobPositionId"].setValue(e.target.value, {
      onlySelf: true,
    });
  }
    get departmentIdValue(){
      return this.EmpForm.get('departmentid') as number;
  }

}  