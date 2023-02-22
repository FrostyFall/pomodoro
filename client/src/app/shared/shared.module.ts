import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MenuTriggerComponent } from './components/menu-trigger/menu-trigger.component';
import { MenuComponent } from './components/menu/menu.component';
import { TaskComponent } from './components/task/task.component';
import { OrderByIdPipe } from './pipes/order-by-id.pipe';
import { RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import { SnackbarComponent } from './components/snackbar/snackbar.component';

@NgModule({
  declarations: [
    MenuTriggerComponent,
    MenuComponent,
    TaskComponent,
    OrderByIdPipe,
    SnackbarComponent,
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterModule,
    HighchartsChartModule,
  ],
  exports: [
    MenuTriggerComponent,
    MenuComponent,
    SnackbarComponent,
    HighchartsChartModule,
  ],
})
export class SharedModule {}
