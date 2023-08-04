import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {

  private fb          = inject(FormBuilder); //inyeccion de dependencias
  private authService = inject(AuthService);
  private router      = inject(Router);
}
