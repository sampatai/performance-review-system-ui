import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidationMessageComponent } from '../../shared/component/validation-message/validation-message.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService } from '../services/account.service';
import { of, switchMap, take } from 'rxjs';
import { User } from '../../shared/models/accounts/user/User';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ValidationMessageComponent, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],  // Fixed typo: 'styleUrl' should be 'styleUrls'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessage: string[] = [];
  returnUrl: string | null = null;
  

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService
  ) {
    // Check if the user is already logged in
    this.accountService.user$
      .pipe(
        take(1),
        switchMap((user: User | null) => {
          if (user) {
            // If user is already logged in, navigate to the home page
            this.router.navigateByUrl('/');
            return of(null); // Return null to complete the observable chain
          } else {
            // If no user is logged in, get the returnUrl from the query parameters
            return this.activatedRoute.queryParamMap.pipe(take(1));
          }
        })
      )
      .subscribe({
        next: (params: any) => {
          if (params) {
            this.returnUrl = params.get('returnUrl'); // Set returnUrl to the query param
          }
        },
      });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.submitted = true;
    this.errorMessage = [];
    if (this.loginForm.valid) {
      // Call login API
      this.accountService.login(this.loginForm.value).subscribe({
        next: (_) => {
                  
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigateByUrl('/dashboard');
          }
        },
        error: (err) => {
          this.submitted = false;
          this.errorMessage.push('Login failed: ' + err.message);
        }
      });
    }
  }
}
