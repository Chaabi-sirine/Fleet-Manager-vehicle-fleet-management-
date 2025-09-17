import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard-module').then(m => m.DashboardModule) },
  { path: 'vehicles', loadChildren: () => import('./features/vehicles/vehicles-module').then(m => m.VehiclesModule) },
  { path: 'missions', loadChildren: () => import('./features/missions/missions-module').then(m => m.MissionsModule) },
  { path: 'fuel', loadChildren: () => import('./features/fuel/fuel-module').then(m => m.FuelModule) },
  { path: 'entretiens', loadChildren: () => import('./features/entretiens/entretiens-module').then(m => m.EntretiensModule) },
  { path: 'users', loadChildren: () => import('./features/users/users-module').then(m => m.UsersModule) },
  { path: 'reports', loadChildren: () => import('./features/reports/reports-module').then(m => m.ReportsModule) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' } // fallback
];
