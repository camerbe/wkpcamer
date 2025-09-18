import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '@wkpcamer/actions';
import { UserDetail } from '@wkpcamer/models';
import { PasswordMatchValidator, PasswordStrengthValidator } from '@wkpcamer/users';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'lib-change-password',
  imports: [ButtonModule,CardModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {


  id!:number;
  theMail!:string;
  currentYear: number = new Date().getFullYear();
  changePwForm!: FormGroup;
  fb=inject(FormBuilder);
  userService=inject(UserService);
  router=inject(Router);
  activatedRoute=inject(ActivatedRoute);

  ngOnInit(): void {
    this.theMail=  this.activatedRoute.snapshot.params['email']
    this.initializeForm();
    this.activatedRoute.data.subscribe({
       next:(data) =>{
          const user =data["user"];
          const resData=user["data"]
          this.changePwForm.patchValue(resData);
      }
    });
  }
  initializeForm() {
     this.changePwForm = this.fb.group({
      fullName: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      password:['',[Validators.required,PasswordStrengthValidator()]],
      confirmPassword:['',[Validators.required]],

    }, { validators: PasswordMatchValidator });
  }

  get fullName(){
    return this.changePwForm.get('nom');
  }
  get prenom(){
    return this.changePwForm.get('prenom');
  }
  get nom(){
    return this.changePwForm.get('nom');
  }
  get email(){
    return this.changePwForm.get('email');
  }
  get password(){
    return this.changePwForm.get('password');
  }
  get confirmPassword(){
    return this.changePwForm.get('confirmPassword');
  }
  onSubmit() {
    console.log(this.changePwForm.value)
    this.userService.activeUser(this.changePwForm.value).subscribe({
      next:(data)=>{
        console.log(data)
        this.router.navigate(['login']);
      }
    });
  }

}
