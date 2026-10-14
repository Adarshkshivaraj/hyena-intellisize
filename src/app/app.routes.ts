import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tab1', pathMatch: 'full' },
  {
    path: 'tab1',
    title: 'Plugin Sizing · Resource Insight Hub',
    loadComponent: () =>
      import('./features/tab1/tab1.component').then((m) => m.Tab1Component),
  },
  {
    path: 'tab2',
    title: 'Resource Planner · Resource Insight Hub',
    loadComponent: () =>
      import('./features/tab2/tab2.component').then((m) => m.Tab2Component),
    children: [
      { path: '', redirectTo: 'workspace', pathMatch: 'full' },
      {
        path: 'workspace',
        loadComponent: () =>
          import('./features/tab2/workspace/workspace.component').then(
            (m) => m.WorkspaceComponent,
          ),
      },
      {
        path: 'summary',
        loadComponent: () =>
          import('./features/tab2/summary/summary.component').then(
            (m) => m.SummaryComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'tab1' },
];
