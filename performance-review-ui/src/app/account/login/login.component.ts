import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationMessageComponent } from '../../shared/component/validation-message/validation-message.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { map, of, switchMap, take } from 'rxjs';
import { SubmitButtonComponent } from "../../shared/component/submit-button/submit-button.component";
import { CommonModule } from '@angular/common';
import { Login } from '../../shared/models/accounts/Login/login.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    ValidationMessageComponent, 
    RouterModule, 
    SubmitButtonComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  protected destroyRef=inject(DestroyRef);

  loginForm = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  submitted = signal(false);
  errorMessages = signal<string[]>([]);
  returnUrl = signal<string | null>(null);

  constructor() {
    this.checkAuthentication();
  }

  private checkAuthentication() {
    this.accountService.user$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(user => user ? this.handleAuthenticatedUser() : this.getReturnUrl())
      )
      .subscribe();
  }

  private handleAuthenticatedUser() {
    this.router.navigateByUrl('/');
    return of(null);
  }

  private getReturnUrl() {
    return this.route.queryParamMap.pipe(
      take(1),
      map(params => this.returnUrl.set(params.get('returnUrl'))))
  }

  login() {
    this.submitted.set(true);
    this.errorMessages.set([]);
    
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
        const login: Login = {
            userName: formValues.userName!, 
            password: formValues.password!,   
              
          };
      this.accountService
      .login(login)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.navigateAfterLogin(),
        error: (err) => this.handleLoginError(err)
      });
    }
  }

  private navigateAfterLogin() {
    const url = this.returnUrl() ?? '/dashboard';
    this.router.navigateByUrl(url);
  }

  private handleLoginError(err: any) {
    this.submitted.set(false);
    this.errorMessages.set(['Login failed: ' + err.message]);
  }
  
}