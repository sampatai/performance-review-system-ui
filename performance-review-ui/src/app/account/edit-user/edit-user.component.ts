import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Team } from '../../shared/Enums/Team';
import { Role } from '../../shared/Enums/Role';

import { ValidationMessageComponent } from '../../shared/component/validation-message/validation-message.component';
import { SubmitButtonComponent } from '../../shared/component/submit-button/submit-button.component';
import { of, switchMap, take } from 'rxjs';
import { editRegister } from '../../shared/models/accounts/register/register-edit.model';
import { register } from '../../shared/models/accounts/register/register.model';
import { manager } from '../../shared/models/accounts/register/manager.model';
import { ErrorHandlingService } from '../../shared/service/error-handler.service';

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
  private errorHandler = inject(ErrorHandlingService);
  submitted = signal(false);
  teams = Team.allTeams;
  roles = Role.allRoles;
  errorMessages = signal<string[]>([]);
  staffId?: string;
  managers=signal<manager[]>([]);
  loadingManager=signal(false);
  selectManager=signal<manager | null>(null);

  editRegisterForm = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    team: [null as number | null, [Validators.required]],
    role: [null as number | null, [Validators.required]],
    managerId:[null as number | null]
  });
  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        take(1),
        switchMap((params) => {
          this.staffId = params.get('id') ?? undefined;
          return this.staffId ? this.accountService.getUserById(this.staffId) : of(null);
        })
      )
      .subscribe({
        next: (user) => {
          if (user) {
            
            this.editRegisterForm.reset();
            this.editRegisterForm.patchValue(user);
          this.loadManagers(user.team,user.managerId);
          }
        },
        error: (err) => this.errorMessages.set(['Failed to load user data']),
      });
      this.editRegisterForm.get('team')?.valueChanges.subscribe((teamId) => {
        this.loadManagers(teamId);
      });
  }

  saveChanges() {
   this.submitted.set(true);
   this.errorMessages.set([]);
   if(this.editRegisterForm.valid){
    const formData=this.editRegisterForm.getRawValue() as register;
    this.accountService.updateUser(formData,this.staffId)
    .pipe(take(1))
    .subscribe({
      next:()=>this.router.navigate(['/staff/list'],{
        state:{message:'Updated successfully.'}
      }),
      error:(err)=>{
        this.submitted.set(false);
      }
    })
   }
  }
 private loadManagers(teamId?: number | null, preselectManagerId?: number | null):void {
  if (!teamId) {
    this.managers.set([]);
    this.editRegisterForm.get('managerId')?.setValue(null);
    return;
  } 
    this.loadingManager.set(true);
    if(teamId){
      this.accountService
      .getManagers(teamId)
      .pipe(take(1))
      .subscribe({
        next:(m)=>{
          this.managers.set(m)
          if(preselectManagerId){
            this.editRegisterForm.get('managerId')
            ?.setValue(preselectManagerId)
          }else{
            this.editRegisterForm.get('managerId')?.setValue(null);
          }

        },
        error:(err)=> this.errorHandler.handleHttpError(err,this.errorMessages),
        complete:()=>this.loadingManager.set(false)
      })
    }else{
      this.loadingManager.set(false);
    }
    }
    
}
