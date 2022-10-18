import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders }    from '@angular/common/http';  
import { EnvironmentUrlService } from './environment-url.service';
import { EmployeeDto } from 'src/app/_interfaces/EmployeeDto.model';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {

  constructor(private http: HttpClient , private envUrl: EnvironmentUrlService) { }  
  httpOptions = {  
    headers: new HttpHeaders({  
      'Content-Type': 'application/json'  
    })  
  }    
 
  public getData = () => {
    return this.http.get(this.createCompleteRoute('api/Employee', this.envUrl.urlAddress));
  }

  postData(empDto: EmployeeDto){  
    return this.http.post(this.createCompleteRoute('api/Employee', this.envUrl.urlAddress), empDto);  
  }  
  
  putData(empDto: EmployeeDto){  
    return this.http.put(this.createCompleteRoute('api/Employee', this.envUrl.urlAddress), empDto);  
  }  
  deleteData(id: number){  
    return this.http.delete(this.createCompleteRoute('api/Employee/', this.envUrl.urlAddress)+id);  
  }  
  GetDataById(id: number){  
    return this.http.get(this.createCompleteRoute('api/Employee/', this.envUrl.urlAddress)+id);  
  }  

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }

}
