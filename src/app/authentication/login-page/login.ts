import { CommonModule } from '@angular/common';
import { Component, inject, model, NgModule, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthClient } from 'app/authentication/auth-client';
import { Button, ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { Observable } from 'rxjs';

@Component({
  selector: 'mnd-login',
  imports: [CommonModule,FormsModule, ButtonModule,RouterModule,Select],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit{
  ngOnInit(): void {
    // this.login();
  }
  // public selectedusername= model<string>('');
  public username =model<string|null>(null);
  public password =model<string|null>(null);
  router=inject(Router)
  private _auth=inject(AuthClient);
  public users:Observable<string[]> = this._auth.FetchUsernames();
  // public users: string[]=['manu','cleo','visitor']
  login() {
    const
    username = this.username(),
    password = null;
    if (username) {
      this._auth.Authenticate(username, password)
      .subscribe({
        next: () => this.router.navigate(['/mymandado', `${username}`]),
        error: e => console.error(e),
      });
    }
  }
}
export interface loginData { username: string; }
