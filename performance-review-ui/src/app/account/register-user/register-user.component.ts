import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Team } from '../../shared/Enums/Team';
import { Role } from '../../shared/Enums/Role';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/component/breadcrumb/breadcrumb.component';
import { SubmitButtonComponent } from '../../shared/component/submit-button/submit-button.component';
import { ValidationMessageComponent } from '../../shared/component/validation-message/validation-message.component';
import { register } from '../../shared/models/accounts/register/register.model';
import { ErrorHandlingService } from '../../shared/service/error-handler.service';
import { manager } from '../../shared/models/accounts/register/manager.model';
import { take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    BreadcrumbComponent,
    SubmitButtonComponent,
    ValidationMessageComponent,
  ],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css',
})
export class RegisterUserComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlingService);
  protected destroyRef=inject(DestroyRef);

  // Component State
  submitted = signal(false);
  teams = Team.allTeams;
  roles = Role.allRoles;
  errorMessages = signal<string[]>([]);

  managers = signal<manager[]>([]);
  loadingManager = signal(false);

  selectedManager = signal<manager | null>(null);

  // Form Group with Type Safety
  registerForm: FormGroup<{
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  team: FormControl<number>;
  role: FormControl<number>;
  managerId: FormControl<number | null>; 
}>;
constructor() {
  this.registerForm = this.formBuilder.group({
    firstName: new FormControl('', { 
      validators: [Validators.required], 
      nonNullable: true 
    }),
    lastName: new FormControl('', { 
      validators: [Validators.required], 
      nonNullable: true 
    }),
    email: new FormControl('', { 
      validators: [Validators.required, Validators.email], 
      nonNullable: true 
    }),
    team: new FormControl(0, { 
      validators: [Validators.required], 
      nonNullable: true 
    }),
    role: new FormControl(0, { 
      validators: [Validators.required], 
      nonNullable: true 
    }),
    managerId: new FormControl<number | null>(null),
  });
}
  ngOnInit(): void {
    this.registerForm.get('team')?.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((teamId) => {
      this.loadManagers(teamId);
    });
  }
  register() {
    this.submitted.set(true);
    this.errorMessages.set([]);

    if (this.registerForm.valid) {
      const registerData: register = this.registerForm.getRawValue();

      this.accountService
      .register(registerData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/staff/list']),
        error: (error) => {
          this.errorHandler.handleHttpError(error, this.errorMessages);
          this.submitted.set(false);
        },
      });
    }
  }
  
  loadManagers(teamId :number|null): void { 
    this.selectedManager.set(null);
    this.managers.set([]);
    this.loadingManager.set(true);
    if (teamId) {
      this.accountService
        .getManagers(teamId)
        .pipe(take(1))
        .subscribe({
          next: (m) => this.managers.set(m),
          error: (err) =>
            this.errorHandler.handleHttpError(err, this.errorMessages),
          complete: () => this.loadingManager.set(false),
        });
    } else {
      this.loadingManager.set(false);
    }
  }
}
