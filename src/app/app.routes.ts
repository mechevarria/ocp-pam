import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TableComponent } from './table/table.component';
import { DetailComponent } from './detail/detail.component';
import { TaskComponent } from './task/task.component';
import { ApproveComponent } from './approve/approve.component';

export const AppRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: {
      breadcrumb: 'Home'
    },
    children: [
      {
        path: 'table',
        component: TableComponent,
        data: {
          breadcrumb: 'Table'
        }
      },
      {
        path: 'detail',
        component: DetailComponent,
        data: {
          breadcrumb: 'Detail'
        }
      },
      {
        path: 'task',
        component: TaskComponent,
        data: {
          breadcrumb: 'Tasks'
        }
      },
      {
        path: 'approve',
        component: ApproveComponent,
        data: {
          breadcrumb: 'Lease Approve'
        }
      }
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
