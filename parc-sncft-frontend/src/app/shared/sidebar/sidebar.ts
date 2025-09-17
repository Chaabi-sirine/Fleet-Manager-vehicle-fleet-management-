import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <i class="fas fa-truck"></i>
        </div>
      </div>

      <!-- Image sous le header, au-dessus du menu -->
      <div class="sidebar-image-container">
        <img src="assets/12.png" alt="photo de profil administrateur" class="sidebar-profile-image" />
      </div>
      <nav class="sidebar-nav">
        <a 
          routerLink="/dashboard" 
          routerLinkActive="active"
          class="nav-item"
        >
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </a>
        
        <a 
          routerLink="/vehicles" 
          routerLinkActive="active"
          class="nav-item"
        >
          <i class="fas fa-truck"></i>
          <span>Véhicules</span>
        </a>
        
        <a 
          routerLink="/missions" 
          routerLinkActive="active"
          class="nav-item"
        >
          <i class="fas fa-route"></i>
          <span>Missions</span>
        </a>
        
        <a 
          routerLink="/fuel" 
          routerLinkActive="active"
          class="nav-item"
        >
          <i class="fas fa-gas-pump"></i>
          <span>Carburant</span>
        </a>
        
        <a 
          routerLink="/entretiens" 
          routerLinkActive="active"
          class="nav-item"
        >
          <i class="fas fa-wrench"></i>
          <span>Entretiens</span>
        </a>
        
        <a 
          routerLink="/users" 
          routerLinkActive="active"
          class="nav-item"
        >
          <i class="fas fa-users"></i>
          <span>Utilisateurs</span>
        </a>
        
        <a 
          routerLink="/reports" 
          routerLinkActive="active"
          class="nav-item"
        >
          <i class="fas fa-chart-bar"></i>
          <span>Rapports</span>
        </a>
      </nav>



      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-info">
            <div class="user-name">Admin</div>
            <div class="user-role">Administrateur</div>
          </div>
        </div>
      </div>
    </aside>
  `,
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  constructor(private router: Router) {}
}
