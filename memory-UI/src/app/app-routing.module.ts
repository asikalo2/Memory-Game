import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },  { path: 'start', loadChildren: './start/start.module#StartPageModule' },
  { path: 'level', loadChildren: './level/level.module#LevelPageModule' },
  { path: 'key-list', loadChildren: './key-list/key-list.module#KeyListPageModule' },
  { path: 'enter-code', loadChildren: './enter-code/enter-code.module#EnterCodePageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
