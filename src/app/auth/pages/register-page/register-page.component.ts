import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {

  private fb          = inject(FormBuilder); //inyeccion de dependencias
  private authService = inject(AuthService);
  private router      = inject(Router);

  public myForm:FormGroup = this.fb.group({
    email:    ['ayb_a_job@gmail.com', [Validators.required, Validators.email]],
    name : ['Ayoub 3', [Validators.required ]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
  });

  register(){
    const {email, name, password} = this.myForm.value;
    console.log({ email, name, password})

    this.authService.register(email, name, password)
        .subscribe({
          next: () => {
            Swal.fire('', 'Usuario registrado con éxito','success')
              .then( (resp => {
                  if(resp.value){
                    this.router.navigateByUrl('/dashboard');
                  }
              }))
          },
          error: ( (message) => {
            Swal.fire('Error', message, 'error' )
          })
        }
        );
  }
}
