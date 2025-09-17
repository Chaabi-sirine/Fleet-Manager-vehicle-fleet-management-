import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'auth', loadChildren: () => import('../features/auth/auth-module').then(m => m.AuthModule) }, { path: 'dashboard', loadChildren: () => import('../features/dashboard/dashboard-module').then(m => m.DashboardModule) }, { path: 'vehicles', loadChildren: () => import('../features/vehicles/vehicles-module').then(m => m.VehiclesModule) }, { path: 'missions', loadChildren: () => import('../features/missions/missions-module').then(m => m.MissionsModule) }, { path: 'fuel', loadChildren: () => import('../features/fuel/fuel-module').then(m => m.FuelModule) }, { path: 'users', loadChildren: () => import('../features/users/users-module').then(m => m.UsersModule) }, { path: 'reports', loadChildren: () => import('../features/reports/reports-module').then(m => m.ReportsModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
