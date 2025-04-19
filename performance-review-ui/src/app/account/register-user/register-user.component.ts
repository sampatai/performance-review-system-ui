import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Team } from '../../shared/Enums/Team';
import { Role } from '../../shared/Enums/Role';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from "../../shared/component/breadcrumb/breadcrumb.component";
import { Register } from '../../shared/models/accounts/register/Register.model';
import { SubmitButtonComponent } from "../../shared/component/submit-button/submit-button.component";
import { ValidationMessageComponent } from "../../shared/component/validation-message/validation-message.component";

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, BreadcrumbComponent, SubmitButtonComponent, ValidationMessageComponent],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css',
})
export class RegisterUserComponent {
  private formBuilder = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);

  // Component State
  submitted = signal(false);
  teams = Team.allTeams;
  roles = Role.allRoles;
  errorMessages = signal<string[]>([]);
 // Form Group with Type Safety
 registerForm = this.formBuilder.group({
  firstName: ['', [Validators.required]],
  lastName: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  team: [null as number | null, [Validators.required]],
  role: [null as number | null, [Validators.required]]
});
  register() {
    this.submitted.set(true);
    this.errorMessages.set([]);
    
    if (this.registerForm.valid) {
      const formValues = this.registerForm.value;
    
    
    const registerData: Register = {
      firstName: formValues.firstName!, 
      lastName: formValues.lastName!,   
      email: formValues.email!,         
      team: Number(formValues.team),    
      role: Number(formValues.role)     
    };
      
      this.accountService.register(registerData).subscribe({
        next: () => this.router.navigate(['/staff/list']),
        error: (error) => {
          this.errorMessages.set(
            error.error?.errors 
              ? [...error.error.errors]  // Spread operator to create new array
              : [error.error || 'An unknown error occurred']  // Fallback message
          );
            this.submitted.set(false);
        }
      });
    }
  }
}