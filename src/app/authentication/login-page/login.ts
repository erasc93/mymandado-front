import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthClient } from 'app/authentication/auth-client';
import { Button, ButtonModule } from 'primeng/button';

@Component({
  selector: 'mnd-login',
  imports: [CommonModule,FormsModule, ButtonModule,RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit{
  ngOnInit(): void {
    this.login();
  }
  protected username= signal<string>('manu');
  router=inject(Router)
  private _auth=inject(AuthClient);
  login() {
    const
    username = this.username(),
    password = null;
    this._auth.Authenticate(username, password)
    .subscribe({
      next: () => this.router.navigate(['/mymandado', `${username}`]),
      error: e => console.error(e),
    });
  }
}
export interface loginData { username: string; }
