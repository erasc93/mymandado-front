import { Injectable, signal } from "@angular/core";

@Injectable({providedIn:'root'})
export class AppState {
   tab = signal<TabView>(TabView.todos);
}
export enum TabView{
   todos,
   done,
   products
}
