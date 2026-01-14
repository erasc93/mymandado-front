import { CommonModule } from '@angular/common';
import { Component, inject, model, NgModule, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthClient } from 'app/authentication/auth-client';
import { Button, ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'mnd-login',
  imports: [CommonModule,FormsModule, ButtonModule,RouterModule,Select],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private _router=inject(Router)
  private _auth=inject(AuthClient);
  
  public username =model<string|null>(null);
  public password =model<string|null>(null);

  public users$: Observable<string[]> = this._auth.FetchUsernames()
    .pipe(tap(users => { const u = users.find(u => u.startsWith('visi')); this.username.set(u??users[0]) }));
  
  login() {
    const username = this.username();

    if (username) {
      this._auth.Authenticate(username, this.password())
      .subscribe({
        next: () => this._router.navigate(['/mymandado', `${username}`]),
        error: e => console.error(e),
      });
    }
  }
}