export interface EmployeeDto {
     employeeId: number;
     identifierNumber: number;
     fullName: string;
     homeAddress: string;
     birthDate: Date;
     joinDate: Date;
     endDate: Date;
     jobStatusId: number;
     departmentId: number;
     jobPositionId: number;
     Dependents : Array<Dependent>;
     EmployeeAttachments: Array<any>;
     SalaryDetails: Array<SalaryDetail>;
}

export interface Dependent
{
    identifierNumber: number;
    fullName: string;
    birthDate: Date;

}

export interface EmployeeAttachment
{
   // documentNo: number;
    file: string;
    issueDate : Date;
    expiryDate : Date;
    fileName: string;
}

export interface SalaryDetail
{
    BasicSalary: number;
    Housing: number;
    Transport: number;
}
export interface Department
{
    id: number;
    name: string;
}

export interface Position
{
    id: number;
    name: string;
}