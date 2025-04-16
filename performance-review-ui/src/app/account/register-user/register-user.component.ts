import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Team } from '../../shared/Enums/Team';
import { Role } from '../../shared/Enums/Role';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css',
})
export class RegisterUserComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  submitted = false;
  teams: Team[] = [];
  roles: Role[] = [];
  errorMessage: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.initRegister();
    this.teams = Team.allTeams;
    this.roles = Role.allRoles;
  }
  initRegister() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      team: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }
  register() {
    this.submitted = true;
    this.errorMessage = [];
    if (this.registerForm.valid) {
      this.accountService.register(this.registerForm.value).subscribe({
        next: (response: any) => {
          
            this.router.navigate(['/staff/list']);
        },
        error: (error) => {
          if (error.error.errors) {
            this.errorMessage = error.error.errors;
          } else {
            this.errorMessage.push(error.error);
          }
        },
      });
    }
  }
}
