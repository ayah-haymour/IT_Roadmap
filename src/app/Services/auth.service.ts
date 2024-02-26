import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http :HttpClient, private router: Router,private toastr:ToastrService,private spinner:NgxSpinnerService) { }
  
  getCurrentUser(): any {
     
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  }


  GetAllUsersEmail(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7274/api/User/GetAllUsersEmail');
  }
  
  isEmailAlreadyRegistered(email: string): Observable<boolean> {
    return this.GetAllUsersEmail().pipe(
      map(allUserEmails => allUserEmails.some(user => user.email === email))
    );
  }
  
  createUser(body: any): Observable<any> {
    const userEmail = body.email;

    return this.isEmailAlreadyRegistered(userEmail).pipe(
      switchMap(isRegistered => {
        if (isRegistered) {
          this.toastr.error("Email already registered")
          return of({ error: 'Email already registered' });
        } else {
          body.Profileimage = this.display_image;
          return this.http.post('https://localhost:7274/api/User/CreateUser', body).pipe(
            catchError(error => {
              console.error('Error creating user:', error);
              return of({ error: 'Error creating user' });
            })
          );
        }
      })
    );
  }


  display_image: any;
  uploadAttachment(file: FormData){
    this.spinner.show();
     
    this.http.post('https://localhost:7274/api/User/UploadImage', file).subscribe((resp:any)=>{
    this.display_image = resp.profileimage;
    this.spinner.hide();

    },err=>{ 
      console.log(err.message);
      console.log(err.status);
    })
  }

}
