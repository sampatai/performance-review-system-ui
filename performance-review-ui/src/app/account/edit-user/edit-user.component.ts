import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Team } from '../../shared/Enums/Team';
import { Role } from '../../shared/Enums/Role';

@Component({
  selector: 'app-edit-user',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {
  private formBuilder=inject(FormBuilder);
  private accountService=inject(AccountService);  
  private router=inject(Router);
  submitted = false;
    teams = Team.allTeams;
    roles = Role.allRoles;
    errorMessages: string[] = [];

editRegisterForm = this.formBuilder.group({
  firstName: ['', [Validators.required]],
  lastName: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  team: [null as number | null, [Validators.required]],
  role: [null as number | null, [Validators.required]]
});

register() {
throw new Error('Method not implemented.');
}


}
