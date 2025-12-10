import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Header } from './header';
import { LoginService } from './login-service';
import { EmailField } from './email-field';
import { PasswordField } from './password-field';

@Component({
  selector: 'ck-login',
  imports: [MatButtonModule, FormsModule, ReactiveFormsModule, Header, EmailField, PasswordField],
  template: `
    <div class="flex justify-center">
      <div class="w-full min-w-[310px] max-w-md h-auto px-8 py-6 mt-4 bg-white shadow-lg">
        <ck-header />
        <div class="flex justify-center">
          <form
            [formGroup]="loginForm"
            #formDirective="ngForm"
            (ngSubmit)="submitForm(loginForm.value, formDirective)"
            class="w-full">
            <ck-email-field />
            <ck-password-field />
            <div class="flex items-baseline justify-between mt-4">
              <button mat-raised-button type="submit" [disabled]="!loginForm.valid" color="primary">Sign In</button>
              <a href="/home" class="text-sm text-blue-600 hover:underline" (click)="forgotPassword()"
                >Forgot password?</a
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoginService],
})
export class Login {
  private readonly loginService: LoginService = inject(LoginService);

  protected readonly loginForm = this.loginService.loginForm;
  protected submitForm = this.loginService.submitForm.bind(this.loginService);
  protected forgotPassword = this.loginService.forgotPassword.bind(this.loginService);
}
