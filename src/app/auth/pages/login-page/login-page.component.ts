import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)

  public form = this.fb.group({
    email: ['daniela@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]]
  })

  constructor() {}

  public login() {
    if (this.form.invalid) return

    const {
      email = '',
      password = ''
    } = this.form.value

    if (!email || !password) return

    this.authService.login(email, password)
      .subscribe({
        next: (success) => {
          if (success) {
            this.router.navigateByUrl('/dashboard')
          } else {
            Swal.fire('Error', 'Something went wrong', 'error')
          }
        },
        error: (error) => {
          Swal.fire('Error', error, 'error')
        },
      })

  }
}
