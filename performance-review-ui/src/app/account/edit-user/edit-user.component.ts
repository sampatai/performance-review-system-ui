import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Team } from '../../shared/Enums/Team';
import { Role } from '../../shared/Enums/Role';

import { ValidationMessageComponent } from '../../shared/component/validation-message/validation-message.component';
import { SubmitButtonComponent } from '../../shared/component/submit-button/submit-button.component';
import { of, switchMap } from 'rxjs';
import { editRegister } from '../../shared/models/accounts/register/register-edit.model';

@Component({
  selector: 'app-edit-user',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ValidationMessageComponent,
    SubmitButtonComponent,
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  submitted = signal(false);
  teams = Team.allTeams;
  roles = Role.allRoles;
  errorMessages = signal<string[]>([]);

  editRegisterForm = this.formBuilder.group({
    id: [''],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    team: [null as number | null, [Validators.required]],
    role: [null as number | null, [Validators.required]],
  });
  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          return id ? this.accountService.getUserById(id) : of(null);
        })
      )
      .subscribe({
        next: (user) => {
          if (user) {
            
            this.editRegisterForm.reset();
            this.editRegisterForm.patchValue(user);
          }
        },
        error: (err) => this.errorMessages.set(['Failed to load user data']),
      });
  }

  saveChanges() {
   this.submitted.set(true);
   this.errorMessages.set([]);
   if(this.editRegisterForm.valid){
    const formData=this.editRegisterForm.getRawValue() as editRegister;
    this.accountService.updateUser(formData).subscribe({
      next:()=>this.router.navigate(['/staff/list'],{
        state:{message:'Updated successfully.'}
      }),
      
    })
   }
  }
}
