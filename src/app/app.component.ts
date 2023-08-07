import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EmployeeService } from './employee.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees! : Employee[] ; 
  public e! : Employee;
  public editEmployee! : Employee;
  public deleteEmployee!: Employee;
  constructor( private es : EmployeeService ) { } 
  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees() : void
  {
    this.es.getEmployees().subscribe(
      (data : Employee[]) =>{ 
      this.employees = data;
      },
      (error : HttpErrorResponse) => {
       alert(error.message);
      } );   
  }


  public onAddEmployee(addForm: NgForm): void {
    document.getElementById('add-employee-form')?.click();
    this.es.addEmployee(addForm.value)
      .subscribe((data : Employee) => {
      this.e = data
      this.getEmployees();
      addForm.reset();
    },

    (error: HttpErrorResponse) => {
      alert(error.message);
      addForm.reset();
    }
  );
  }

  public onUpdateEmployee(employee : Employee): void {
    this.es.updateEmployee(employee)
      .subscribe((data : Employee) => {
      this.e = data
      this.getEmployees();
    },

    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
  }


  public onDeleteEmloyee(employeeId: number): void {
    this.es.deleteEmployee(employeeId).subscribe(
      (data: void) => {
        console.log(data);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployee( key : string ) : void
  {
    const res : Employee[] =[] ;
    for (const employee of this.employees)
    {
      if ( employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 
        || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1
           )
      {
          res.push(employee);
      }
    }
    this.employees = res;
    if (res.length === 0 || !key )
    {
      this.getEmployees();
    }
  } 

  public onOpenModal(employee : Employee , mode : string) : void 
  {
    const container = document.getElementById('main-container')
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle','modal');
    if(mode ==="add" )
    {
      button.setAttribute('data-target','#addEmployeeModal');
    }
    if(mode ==="edit" )
    {
      this.editEmployee = employee;
      button.setAttribute('data-target','#updateEmployeeModal');
    }
    if(mode ==="delete" )
    {
      this.deleteEmployee = employee;
      button.setAttribute('data-target','#deleteEmployeeModal');
    }
    container?.appendChild(button);
    button.click();
  }





}
