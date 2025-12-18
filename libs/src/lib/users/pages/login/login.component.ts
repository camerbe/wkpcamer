import { AuthenticationService } from '@wkpcamer/auth';
import { LoggedUser } from '@wkpcamer/models';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';
import { LocalstorageService } from '../../../../../shared/src/lib/src/lib/storage/localstorage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'lib-user-login',
  imports: [ButtonModule,CardModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit  {

  loggedUser!:LoggedUser;
  loginForm!: FormGroup;
  errorMessage="L'email ou le mot de passe n'est pas valide";
  isError=false;
  currentYear: number = new Date().getFullYear();

  fb=inject(FormBuilder);
  authService=inject(AuthenticationService);
  localstorageService=inject(LocalstorageService);
  router=inject(Router);

  ngOnInit(): void {
    this.initializeForm();
  }
  onSubmit(){
    this.isError=false
    this.authService.login(this.loginForm.value).subscribe({
      next:(result)=>{
        const tmpData =result
        const { user, ...rest } = result;
        //console.log(tmpData.success);
        //console.log(tmpData.token);
        //console.log(tmpData.user);
        if(tmpData.message=='change_password') {
          //console.log("Toto")
          this.router.navigate(['/changepw',user.email]);
          return
        }
        // console.log(tmpData.message);
        // console.log(tmpData);
        this.localstorageService.setToken(tmpData.token);
        this.router.navigate(['/admin'])
      },
      error:(err:HttpErrorResponse)=>{

        this.isError=true;
        if(err.status>401){
          this.errorMessage="Erreur du serveur, veuillez réessayer plus tard"
        }
        else{
          this.errorMessage="L'email ou le mot de passe n'est pas valide"
        }

      }
    })

  }
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required]],

    });
  }

  get email(){
    return this.loginForm.get('email');
  }
  get password(){
    return this.loginForm.get('password');
  }

}
