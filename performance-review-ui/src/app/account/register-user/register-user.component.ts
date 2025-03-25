import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Team } from '../../shared/Enums/Team';
import { Role } from '../../shared/Enums/Role';

@Component({
  selector: 'app-register-user',
  standalone:true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {
  registerForm: FormGroup = new FormGroup({});
  submitted = false;
  teams=Team.allTeams;
  roles=Role.allRoles;
register(){

}
}
