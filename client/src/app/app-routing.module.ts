import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimerPageComponent } from './core/pages/timer-page/timer-page.component';
import { GraphPageComponent } from './core/pages/graph-page/graph-page.component';
import { NavigateRouteGuard } from './shared/guards/can-activate.guard';

const routes: Routes = [
  {
    path: 'timer',
    pathMatch: 'full',
    component: TimerPageComponent,
    canActivate: [NavigateRouteGuard],
  },
  {
    path: 'graph',
    pathMatch: 'full',
    component: GraphPageComponent,
    canActivate: [NavigateRouteGuard],
  },
  {
    path: '**',
    redirectTo: '/timer',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [NavigateRouteGuard],
  exports: [RouterModule],
})
export class AppRoutingModule {}
