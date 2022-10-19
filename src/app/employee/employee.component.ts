
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
  base64Output : string;
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
      employeeAttachments : this.fb.array([]),
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
          this.data[i].departmentName = this.Departments!.find((x: { id: number; }) => x.id === this.data[i].departmentId); 
          this.data[i].positionName = this.Positions!.find((x: { id: number; }) => x.id === this.data[i].jobPositionId); 
        }
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
      this.EmpForm.value.jobPositionId = stringToSplit.split(" ")[1];
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
    let stringToSplit =  e.target.value;
    this.EmpForm.value.jobPositionId = stringToSplit.split(" ")[1];
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

  private newAttachment(): FormGroup {
    return this.fb.group({
      documentNo: [null],
      issueDate: [null],
      expiryDate: [null],
      file: [''],
      fileName: [''],
    });
  }

  addAttachment(): void {
    this.employeeAttachments.push(this.newAttachment());
  }

  deleteAttachment(i:number){
    const attachment = (this.EmpForm.get('employeeAttachments')as FormArray);
    attachment.removeAt(i);
   // if(attachment.length===0) this.addAttachment();
  }



  uploadFile = (event,recordIndex) => {
    debugger;
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }     
      const file = files[0];
      this.showFileName = file.name;
      	
    this.convertFile(file).subscribe(base64 => {
	  this.base64Output = base64;
    this.EmpForm.value.file = this.base64Output;
    this.EmpForm.value.fileName = file.name;
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





 //   this.fb.group({
      //   issueDate: new FormControl(''),
      //   expiryDate: new FormControl(''),
      //   file: new FormControl(''),
      //   fileName: new FormControl('')
      // })]), 

      // issueDate:this.fb.control(''),
      // expiryDate:this.fb.control(''),
      // file : this.fb.control(''),
      // fileName : this.fb.control(''),

 //////////Add Files////////
   
       // this.employeeAttachments.push(new FormGroup({
        //   issueDate: new FormControl( files[index].issueDate),
        //   expiryDate: new FormControl( files[index].expiryDate),
        //   file: new FormControl( reader.readAsDataURL(file)),
        //   fileName: new FormControl( files[index].fileName)
        // }));

      //this.employeeAttachments.push({issueDate: this.EmpForm.get('issueDate'), expiryDate: this.EmpForm.get('expiryDate'),
      // file :  this.EmpForm.get('file')} )
      //this.addEmployeeAttachment();
      // const formData = new FormData();
      // formData.append('file', fileToUpload, fileToUpload.name);
    //}
    ////////////////////////////////

 // get employeeAttachmentsControl() {
  //   return this.EmpForm.controls['employeeAttachments'].value as FormArray;
  // }

  //addEmployeeAttachment() {
    //this.addAttachment();
    // console.log('count|', this.employeeAttachmentsControl.length);
    // this.employeeAttachmentsControl.push(new FormGroup({
    //   issueDate: new FormControl(''),
    //   expiryDate: new FormControl(''),
    //   file: new FormControl(''),
    //   fileName: new FormControl('')
    // }));
    // console.log('count||', this.employeeAttachmentsControl.length);

    // issueDate:this.fb.control(''),
      // expiryDate:this.fb.control(''),
      // file : this.fb.control(''),
      // fileName : this.fb.control(''),
  //}

    // this.fb.group({
    //   documentNo: [null],
    //   issueDate: [issueDate],
    //   expiryDate: [expiryDate],
    //   file: [ this.base64Output],
    //   fileName: [file.name],
    // });
    //var y = this.employeeAttachments[recordIndex].get('issueDate');
   // [recordIndex].FormGroup[recordIndex].controls("file").setValue(this.base64Output);
    //console.log(y);
    //this.EmpForm.value.issueDate = this.employeeAttachments[recordIndex].get('issueDate').value;
    //this.EmpForm.value.expiryDate = this.employeeAttachments[recordIndex].get('expiryDate').value;

      // this.EmpForm.controls["file"].setValue(this.base64Output);  
      // this.EmpForm.controls["fileName"].setValue(file.fileName);  
      //const reader = new FileReader();
    //var x =  this.employeeAttachments[recordIndex].controls['issueDate'].value as Date;
    //var y =  this.employeeAttachments[recordIndex].controls['expiryDate'].value as Date;
//console.log(y);
     // this.employeeAttachments[recordIndex].controls("fileName").setValue(file.fileName);
   
    //}