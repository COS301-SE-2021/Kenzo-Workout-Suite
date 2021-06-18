import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'sign-in',
    loadChildren: () => import('./sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full'
  },
  {
    path: 'create-workout',
    loadChildren: () => import('./create-workout/create-workout.module').then( m => m.CreateWorkoutPageModule)
  },
  {
    path: 'create-exercise',
    loadChildren: () => import('./create-exercise/create-exercise.module').then( m => m.CreateExercisePageModule)
  },
  {
    path: 'your-workouts',
    loadChildren: () => import('./your-workouts/your-workouts.module').then( m => m.YourWorkoutsPageModule)
  },  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
