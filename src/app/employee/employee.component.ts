
import { Component, OnInit } from '@angular/core';  
import { EmployeeService } from '../shared/services/employee.service';  
import { LookupService } from '../shared/services/lookup.service';  
import { FormControl,Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';   
import { Router } from '@angular/router';
import { Department, Position } from '../_interfaces/EmployeeDto.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  
  title = 'EmployeeFrontEnd';  
  errorMessage: any;
  showError: boolean;
  showFileName: string;
  disableIdentifierEdit: boolean;
  constructor(private EmployeeService: EmployeeService, private router: Router, 
    private LookupService: LookupService, private fb:FormBuilder) { }  
  data: any;  
  EmpForm: FormGroup;  
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
      departmentId : [0], 
      jobPositionId : [0], 
      employeeAttachments : this.fb.array([
        this.newAttachment()
      ]),
      dependents :this.fb.array([]), 
      salaryDetails :this.fb.array([]), 
    });   

  }    

  getdata() {  
    this.EmployeeService.getData()
    .subscribe({
      next: (res:any) => {
        this.data = res;
    },
    error: (err: HttpErrorResponse) => {
      debugger;
      this.errorMessage = err.message;
      this.showError = true;
    }}) 
  }  

  deleteData(id:number) {  
    this.EmployeeService.deleteData(id).subscribe((data) => {
      this.data = data;  
      this.getdata();  
    })  
  }  
  Save() {  
    debugger;
    this.submitted = true;  
     if (this.EmpForm.invalid) {  
            return;  
     }  
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
      
      let stringToSplit =  this.EmpForm.value.jobPositionId ;
      this.EmpForm.value.jobPositionId =  stringToSplit.split(" ")[1];
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
    this.EmpForm.controls["employeeId"].setValue(Data.employeeId);  
    this.EmpForm.controls["fullName"].setValue(Data.fullName);      
    this.EmpForm.controls["identifierNumber"].setValue(Data.identifierNumber);  
    this.EmpForm.controls["homeAddress"].setValue(Data.homeAddress);  
    this.EmpForm.controls["birthDate"].setValue(Data.birthDate);  
    this.EmpForm.controls["joinDate"].setValue(Data.joinDate);  
    this.EmpForm.controls["endDate"].setValue(Data.endDate);  
    this.EmpForm.controls["departmentId"].setValue(Data.departmentId);  
    this.EmpForm.controls["jobPositionId"].setValue(Data.jobPositionId); 
    this.EmpForm.controls['identifierNumber'].disable() 
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
      this.Positions = data;  
    })  
  }  

  changeDepartment(e: any) {
    this.GetPositionByDeptId(this.EmpForm.controls["departmentId"].value);
  }

  changePosition(e: any) {
    this.EmpForm.controls["jobPositionId"].setValue(e.target.value, {
      onlySelf: true,
    });
    // let stringToSplit =  e.target.value;
    // this.EmpForm.value.jobPositionId = stringToSplit.split(" ")[1];
  }

  //get values
    get departmentIdValue(){
      return this.EmpForm.controls['departmentId'].value as number;
  }

  get dependentsControl() {
    return this.EmpForm.controls['dependents'].value as FormArray;
  }

 
  get employeeAttachments(): FormArray {
    return this.EmpForm.get('employeeAttachments') as FormArray;
  }

  private newAttachment() : FormGroup {
    return this.fb.group({
          issueDate: [new Date()],
          expiryDate: [new Date()],
          file: [''],
          fileName: ['']
        })
  }

  addAttachment(): void {
    console.log('employeeAttachments', this.employeeAttachments);
    let index = this.EmpForm.value.employeeAttachments.length;
    if(this.EmpForm.value.employeeAttachments[index-1].file != "")
    {
      this.employeeAttachments.push(this.newAttachment());
    }
  }

  deleteAttachment(i:number){
    const attachment = (this.EmpForm.get('employeeAttachments')as FormArray);
    attachment.removeAt(i);
  }



  uploadFile = (event,recordIndex) => {
    debugger;
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }     
      const file = files[0];
      this.showFileName = file.name;
      let issueDate = document.getElementById('issueDate'+recordIndex) as HTMLInputElement;
      let expiryDate =  document.getElementById('expiryDate'+recordIndex) as HTMLInputElement;
        
  
      this.EmpForm.value.employeeAttachments[recordIndex].fileName = file.name;
      this.EmpForm.value.employeeAttachments[recordIndex].issueDate = new Date(issueDate.value);
      this.EmpForm.value.employeeAttachments[recordIndex].expiryDate = new Date(expiryDate.value);
      this.convertFile(file).subscribe(base64 => {
      this.EmpForm.value.employeeAttachments[recordIndex].file = base64;
      });
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(reader.result.toString()));
    return result;
  }
}  