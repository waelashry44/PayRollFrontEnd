import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders }    from '@angular/common/http';  
import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
  providedIn: 'root'
})

export class LookupService {

  constructor(private http: HttpClient , private envUrl: EnvironmentUrlService) { }  
  httpOptions = {  
    headers: new HttpHeaders({  
      'Content-Type': 'application/json'  
    })  
  }    
  
  public GetDepartments = () => {
    return this.http.get(this.createCompleteRoute('api/Lookup/GetDepartments', this.envUrl.urlAddress));
  }

  public GetPositions = () => {
    return this.http.get(this.createCompleteRoute('api/Lookup/GetPositions', this.envUrl.urlAddress));
  }

  GetPositionByDeptId(departmentId: number){  
    return this.http.get(this.createCompleteRoute('api/Lookup/GetPositionByDeptId?departmentId=', this.envUrl.urlAddress)+departmentId);  
  }  

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }

}
