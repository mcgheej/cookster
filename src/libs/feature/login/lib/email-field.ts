
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginService } from './login-service';

@Component({
  selector: 'ck-email-field',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field class="w-full mt-4" appearance="outline" [formGroup]="loginService.loginForm">
      <mat-label>Email</mat-label>
      <input
        type="email"
        matInput
        [formControlName]="loginService.emailFieldName"
        placeholder="Email"
        spellcheck="false"
        required />
      @if (emailField.invalid) {
        <mat-error>{{ getEmailError() }}</mat-error>
      }
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailField {
  protected loginService = inject(LoginService);

  protected readonly emailField = this.loginService.loginForm.controls.email;

  protected getEmailError(): string {
    if (this.emailField.hasError('required')) {
      return 'You must enter an email address';
    }
    return this.emailField.hasError('email') ? 'Not a valid email' : '';
  }
}
