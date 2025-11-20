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
export class Login {
  private _router=inject(Router)
  private _auth=inject(AuthClient);
  
  public users$:Observable<string[]> = this._auth.FetchUsernames();
  
  public username =model<string|null>(null);
  public password =model<string|null>(null);
  login() {
    const username = this.username(), password = null;

    if (username) {
      this._auth.Authenticate(username, password)
      .subscribe({
        next: () => this._router.navigate(['/mymandado', `${username}`]),
        error: e => console.error(e),
      });
    }
  }
}
