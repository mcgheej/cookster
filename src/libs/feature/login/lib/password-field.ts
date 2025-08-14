import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginService } from './login-service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ck-password-field',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  template: `
    <mat-form-field class="w-full mt-4" appearance="outline" [formGroup]="loginService.loginForm">
      <mat-label>Password</mat-label>
      <input
        [type]="passwordVisibility ? 'text' : 'password'"
        matInput
        [formControlName]="loginService.passwordFieldName"
        placeholder="Password"
        required />
      <mat-icon matSuffix (click)="togglePasswordVisibility()">{{
        passwordVisibility ? 'visibility_off' : 'visibility'
      }}</mat-icon>
      @if (passwordField.hasError('minlength') || passwordField.hasError('required')) {
        <mat-error>{{ getPasswordError() }}</mat-error>
      }
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordField {
  protected readonly loginService = inject(LoginService);

  protected readonly passwordField = this.loginService.loginForm.controls.password;

  protected passwordVisibility = false;

  togglePasswordVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }

  getPasswordError(): string {
    if (this.passwordField.hasError('required')) {
      return 'You must enter a password';
    }
    return this.passwordField.hasError('minlength') ? 'Password must be at least 8 characters' : '';
  }
}
