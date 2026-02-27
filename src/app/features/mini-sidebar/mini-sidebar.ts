import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { filter } from 'rxjs/operators';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-mini-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './mini-sidebar.html',
  styleUrls: ['./mini-sidebar.css']
})
export class MiniLayoutComponent {
  title = 'Reservation Frontend';


  constructor() {
    
  }
}
