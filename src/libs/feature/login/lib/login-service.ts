import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from '@data-access/authentication/index';
import { DEFAULT_SNACKBAR_DURATION, INITIAL_ROUTE_AFTER_LOGIN } from '@util/app-config/index';

const EMAIL_FIELD = 'email';
const PASSWORD_FIELD = 'password';

interface UserDetails {
  email: string | null;
  password: string | null;
}

@Injectable()
export class LoginService {
  private readonly fb = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly auth: AuthenticationService = inject(AuthenticationService);

  readonly loginForm = this.fb.group({
    [EMAIL_FIELD]: ['', [Validators.required, Validators.email]],
    [PASSWORD_FIELD]: ['', [Validators.required, Validators.minLength(8)]],
  });

  get emailFieldName() {
    return EMAIL_FIELD;
  }

  get passwordFieldName() {
    return PASSWORD_FIELD;
  }

  submitForm(formValue: Partial<UserDetails>, formDirective: FormGroupDirective) {
    const email = formValue.email ?? '';
    const password = formValue.password ?? '';

    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl(INITIAL_ROUTE_AFTER_LOGIN),
      error: () => {
        formDirective.resetForm();
        this.loginForm.reset();
        this.snackBar.open('Invalid username/password', 'Close', {
          duration: DEFAULT_SNACKBAR_DURATION,
        });
      },
    });
  }

  forgotPassword() {
    this.snackBar.open('Forgot password not implemented', 'Close', {
      duration: DEFAULT_SNACKBAR_DURATION,
    });
  }
}
