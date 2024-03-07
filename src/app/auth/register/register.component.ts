import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService, Spinner } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm : FormGroup = new FormGroup({
    userName : new FormControl('User Name'), 
    email : new FormControl('ex@example.com'), 
    password :new FormControl('********'), //1-8
    confirmPassword:new FormControl('********'),
    dateOfBirth:new FormControl(''),
    phoneNumber: new FormControl('0123457890'),
    //phoneNumber1: new FormControl('',Validators.pattern(/^[6-9]\d{9}$/)),
    gender: new FormControl(''),
    address: new FormControl(''),
    Profileimage: new FormControl(),
    roleId: new FormControl(2)
 
  });

  constructor( public auth: AuthService, private toastr: ToastrService,private spinner:NgxSpinnerService, private router:Router) {
 
   }

   goToLogin(){
    this.router.navigate(['security/login']);
  }

  private notifyUser() {
    this.toastr.error('You already have account')
    console.log('You already have an account!');
  }

  MatchError(){
    if(this.registerForm.controls['password'].value==
    this.registerForm.controls['confirmPassword'].value)
    this.registerForm.controls['confirmPassword'].setErrors(null)
    else
  
    this.registerForm.controls['confirmPassword'].setErrors({misMatch:true})
  }
 
  clearInput(controlName: string): void {
    const control = this.registerForm.get(controlName);
  
    if (control && !(control as any)['_clearedOnce']) {
      control.setValue('');
      
      (control as any)['_clearedOnce'] = true;
    }
  }

//   Register() {
//     const registrationData = {
//       userName: this.regObj.username,
//       email: this.regObj.email,
//       password: this.regObj.password,
//     confirmPassword: this.regObj.confirmPassword,
//     birthDate: this.regObj.birthDate,
//     phoneNumber: this.regObj.phoneNumber,
//     gender: this.regObj.gender,
//     address: this.regObj.adderss,
//     Profileimage: this.regObj.Profileimage,
//     roleid: 2
//   };
 
// }


// Submit() {
   
//   const userEmail = this.registerForm.controls['email'].value;
//  debugger
//   if (this.registerForm.invalid) {
//     this.toastr.error('Please fill in all required fields', 'Error');
//     return;
//   }
//       this.auth.createUser(this.registerForm.value);
// }

async Submit() {
   
  const userEmail = this.registerForm.controls['email'].value;
 
  if (this.registerForm.invalid) {
    this.toastr.error('Please fill in all required fields', 'Error');
    return;
  }
 
  await this.auth.isEmailAlreadyRegistered(userEmail).subscribe(isRegistered => {
    debugger
    if (isRegistered) {
      this.notifyUser();
      this.goToLogin();
    } else {
      this.spinner.show();
      this.auth.createUser(this.registerForm.value).subscribe(
        resp => {
          console.log('User created successfully!', resp);
          this.toastr.success('Your account created successfully!');
          // this.sendRegistrationEmail(this.registerForm.value.email).subscribe(
          //   response => {
          //     console.log('Email sent successfully:', response);
          //     this.spinner.hide();
          //     this.router.navigate(['security/login']);
          //   },
          //   error => {
          //     console.error('Error sending email:', error);
          //   }
          // );  
          this.spinner.hide(); 
          this.router.navigate(['security/login']);
        }
        ,
        error => {
          this.toastr.error('Fill the form please')
          console.error('Error creating user:', error);
        }
      );
    }
  });

}

UploadImage(file:any){
   
  if(file.length==0) return;
  let fileToUpload=<File> file[0];
  const formData = new FormData();
  formData.append('file',fileToUpload,fileToUpload.name);
  this.auth.uploadAttachment(formData);
}

}
