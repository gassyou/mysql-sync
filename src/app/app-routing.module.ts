import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DbConnectionComponent } from './db-connection/db-connection.component';
import { CompareComponent } from './compare/compare.component';
import { CanCompareGuard } from './service/can-compare.Guard';


const routes: Routes = [

  {path: '', component: CompareComponent, canActivate: [CanCompareGuard]},
  {path: 'connection', component: DbConnectionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
