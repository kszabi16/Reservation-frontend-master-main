import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-dashboard.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminDashboardComponent {

}
