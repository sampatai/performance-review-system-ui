import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Team } from '../../shared/Enums/Team';
import { Role } from '../../shared/Enums/Role';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/component/breadcrumb/breadcrumb.component';
import { SubmitButtonComponent } from '../../shared/component/submit-button/submit-button.component';
import { ValidationMessageComponent } from '../../shared/component/validation-message/validation-message.component';
import { register } from '../../shared/models/accounts/register/register.model';
import { ErrorHandlingService } from '../../shared/service/error-handler.service';
import { manager } from '../../shared/models/accounts/register/manager.model';
import { take } from 'rxjs';


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

  // Component State
  submitted = signal(false);
  teams = Team.allTeams;
  roles = Role.allRoles;
  errorMessages = signal<string[]>([]);

  managers = signal<manager[]>([]);
  loadingManager = signal(false);

  selectedManager = signal<manager | null>(null);

  // Form Group with Type Safety
  registerForm = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: [
      '',
      [Validators.required, Validators.email],
    ],
    team: [null as number | null, [Validators.required]],
    role: [null as number | null, [Validators.required]],
    managerId: [null as number | null]
  });
  ngOnInit(): void {
    this.registerForm.get('team')?.valueChanges
    .pipe(take(1))
    .subscribe((teamId) => {
      this.loadManagers(teamId);
    });
  }
  register() {
    this.submitted.set(true);
    this.errorMessages.set([]);

    if (this.registerForm.valid) {
      const formValues = this.registerForm.value;

      const registerData: register = {
        firstName: formValues.firstName!,
        lastName: formValues.lastName!,
        email: formValues.email!,
        team: Number(formValues.team),
        role: Number(formValues.role),
        managerId: formValues.managerId !== null ? Number(formValues.managerId) : null
      };

      this.accountService.register(registerData).subscribe({
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
