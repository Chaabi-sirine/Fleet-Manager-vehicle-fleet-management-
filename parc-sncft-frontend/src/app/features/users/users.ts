import { Component, OnInit } from '@angular/core';
import { Auth as AuthService } from '../auth/services/auth';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'employee' | 'operator' | 'driver';
  status: 'actif' | 'inactif' | 'conge';
  department: string;
  position: string;
  lastLogin: Date;
  createdAt: Date;
}

interface NewUser {
  username: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  constructor(private authService: AuthService) {}
  users: User[] = [
    {
      id: '1',
      name: 'Ahmed Ben Ali',
      email: 'ahmed.benali@sncft.com',
      phone: '+216 71 123 456',
      role: 'admin',
      status: 'actif',
      department: 'Direction Générale',
      position: 'Directeur IT',
      lastLogin: new Date('2024-08-07 14:30'),
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Fatma Trabelsi',
      email: 'fatma.trabelsi@sncft.com',
      phone: '+216 71 234 567',
      role: 'manager',
      status: 'actif',
      department: 'Ressources Humaines',
      position: 'Manager RH',
      lastLogin: new Date('2024-08-07 09:15'),
      createdAt: new Date('2024-03-20')
    },
    {
      id: '3',
      name: 'Mohamed Karim',
      email: 'mohamed.karim@sncft.com',
      phone: '+216 71 345 678',
      role: 'driver',
      status: 'conge',
      department: 'Transport',
      position: 'Conducteur Senior',
      lastLogin: new Date('2024-08-01 16:45'),
      createdAt: new Date('2024-06-10')
    },
    {
      id: '4',
      name: 'Salma Bourguiba',
      email: 'salma.bourguiba@sncft.com',
      phone: '+216 71 456 789',
      role: 'operator',
      status: 'actif',
      department: 'Opérations',
      position: 'Opérateur Train',
      lastLogin: new Date('2024-08-06 22:30'),
      createdAt: new Date('2024-08-01')
    },
    {
      id: '5',
      name: 'Youssef Mejri',
      email: 'youssef.mejri@sncft.com',
      phone: '+216 71 567 890',
      role: 'employee',
      status: 'inactif',
      department: 'Maintenance',
      position: 'Technicien',
      lastLogin: new Date('2024-07-30 08:00'),
      createdAt: new Date('2024-05-12')
    },
    {
      id: '6',
      name: 'Amal Sassi',
      email: 'amal.sassi@sncft.com',
      phone: '+216 71 678 901',
      role: 'employee',
      status: 'actif',
      department: 'Finance',
      position: 'Comptable',
      lastLogin: new Date('2024-08-07 11:20'),
      createdAt: new Date('2024-04-18')
    }
  ];

  // Search and filter properties
  searchTerm: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';
  filteredUsers: User[] = [...this.users];

  ngOnInit(): void {
    console.log('Users module initialisé');
    this.filteredUsers = [...this.users];
  }

  // ============================================
  // STATISTICS METHODS
  // ============================================
  getTotalUsers(): number {
    return this.users.length;
  }

  getActiveUsers(): number {
    return this.users.filter(user => user.status === 'actif').length;
  }

  getDepartments(): number {
    const uniqueDepartments = new Set(this.users.map(user => user.department));
    return uniqueDepartments.size;
  }

  getAdmins(): number {
    return this.users.filter(user => user.role === 'admin').length;
  }

  // ============================================
  // UTILITY METHODS
  // ============================================
  getUserInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getRoleLabel(role: string): string {
    const labels = {
      'admin': 'Administrateur',
      'manager': 'Manager',
      'employee': 'Employé',
      'operator': 'Opérateur',
      'driver': 'Conducteur'
    };
    return labels[role as keyof typeof labels] || role;
  }

  getStatusLabel(status: string): string {
    const labels = {
      'actif': 'Actif',
      'inactif': 'Inactif',
      'conge': 'En Congé'
    };
    return labels[status as keyof typeof labels] || status;
  }

  formatLastLogin(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Aujourd\'hui';
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  }

  getUserPermissions(role: string): string {
    const permissions = {
      'admin': 'Administration complète',
      'manager': 'Gestion équipe et rapports',
      'employee': 'Accès standard',
      'operator': 'Opérations ferroviaires',
      'driver': 'Conduite trains'
    };
    return permissions[role as keyof typeof permissions] || 'Permissions limitées';
  }

  // ============================================
  // SEARCH & FILTER METHODS
  // ============================================
  onSearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.name.toLowerCase().includes(this.searchTerm) ||
        user.email.toLowerCase().includes(this.searchTerm) ||
        user.department.toLowerCase().includes(this.searchTerm);
      
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      const matchesStatus = !this.selectedStatus || user.status === this.selectedStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  // ============================================
  // ACTION METHODS
  // ============================================
  editUser(user: User): void {
    console.log('Modifier utilisateur:', user);
    // TODO: Implement edit user dialog
  }

  viewUser(user: User): void {
    console.log('Voir utilisateur:', user);
    // TODO: Implement view user dialog
  }

  managePermissions(user: User): void {
    console.log('Gérer les permissions pour:', user);
    // TODO: Implement permissions management dialog
  }

  toggleUserStatus(user: User): void {
    const statusLabels = {
      'actif': 'désactiver',
      'inactif': 'activer',
      'conge': 'modifier statut'
    };
    
    const action = statusLabels[user.status] || 'modifier';
    
    if (confirm(`Voulez-vous ${action} l'utilisateur ${user.name} ?`)) {
      if (user.status === 'actif') {
        user.status = 'inactif';
      } else {
        user.status = 'actif';
      }
      console.log('Statut utilisateur modifié:', user);
      this.applyFilters(); // Refresh filtered list
    }
  }

  // ============================================
  // MODAL FORMULAIRE PROPERTIES & METHODS
  // ============================================
  showAddUserModal: boolean = false;
  
  newUser: NewUser = {
    username: '',
    password: '',
    role: ''
  };

  // Ouvrir le modal d'ajout d'utilisateur
  addUser(): void {
    this.resetNewUserForm();
    this.showAddUserModal = true;
  }

  // Fermer le modal
  closeAddUserModal(): void {
    this.showAddUserModal = false;
    this.resetNewUserForm();
  }

  // Reset du formulaire
  private resetNewUserForm(): void {
    this.newUser = {
      username: '',
      password: '',
      role: ''
    };
  }

  // Soumission du formulaire
  submitUserForm(): void {
    if (this.isFormValid()) {
      const payload = {
        username: this.newUser.username,
        password: this.newUser.password,
        role: this.newUser.role as import('../auth/services/auth').RegisterRole
      };
      this.authService.register(payload).subscribe({
        next: (response) => {
          alert('Réponse backend : ' + JSON.stringify(response));
          this.closeAddUserModal();
        },
        error: (err) => {
          let msg = `Erreur HTTP ${err.status}\n`;
          if (err.error) {
            msg += 'Body : ' + JSON.stringify(err.error);
          }
          alert(msg);
        }
      });
    }
  }

  // Validation du formulaire
  private isFormValid(): boolean {
    return this.newUser.username.trim().length >= 3 &&
           this.newUser.password.trim().length >= 6 &&
           this.newUser.role.trim().length > 0;
  }

  // Générer un ID unique pour l'utilisateur
  private generateUserId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
  }

  // Mapper le rôle du formulaire vers le type User role
  private mapRoleToUserRole(formRole: string): 'admin' | 'manager' | 'employee' | 'operator' | 'driver' {
    const roleMapping: { [key: string]: 'admin' | 'manager' | 'employee' | 'operator' | 'driver' } = {
      'ADMIN': 'admin',
      'SUPERVISEUR': 'manager',
      'CONDUCTEUR': 'driver',
      'TECHNICIEN': 'employee',
      'OPERATEUR': 'operator'
    };
    
    return roleMapping[formRole] || 'employee';
  }

  // Déterminer le département basé sur le rôle
  private getDepartmentByRole(role: string): string {
    const departmentMapping: { [key: string]: string } = {
      'ADMIN': 'Direction Générale',
      'SUPERVISEUR': 'Operations',
      'CONDUCTEUR': 'Transport',
      'TECHNICIEN': 'Maintenance',
      'OPERATEUR': 'Operations'
    };
    
    return departmentMapping[role] || 'Non assigné';
  }

  // Déterminer le poste basé sur le rôle
  private getPositionByRole(role: string): string {
    const positionMapping: { [key: string]: string } = {
      'ADMIN': 'Administrateur Système',
      'SUPERVISEUR': 'Superviseur',
      'CONDUCTEUR': 'Conducteur de Train',
      'TECHNICIEN': 'Technicien de Maintenance',
      'OPERATEUR': 'Opérateur'
    };
    
    return positionMapping[role] || 'Employé';
  }
}
