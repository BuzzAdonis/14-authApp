import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  private fb = inject( FormBuilder );
  private authService = inject( AuthService );
  private router      = inject( Router );
  
  public myForm: FormGroup = this.fb.group({
    email   :['test2@test.com',[ Validators.required, Validators.email ]],
    name    :['Bruno Diaz',[ Validators.required]],
    password:['1234567',[ Validators.required, Validators.minLength(6) ]], 
  });
 register(){
  const {email, password, name} = this.myForm.value;
  this.authService.register(email, password, name)
  .subscribe({
    next: () => this.router.navigateByUrl('/dashboar'),
    error: ( message:any) => {
      Swal.fire('Error', message,'error')
    }
  });
 }
}
