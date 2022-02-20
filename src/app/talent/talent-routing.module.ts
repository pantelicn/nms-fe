import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TalentComponent } from './talent.component';

const routes: Routes = [
  {
    path: '',
    component: TalentComponent,
    children: []
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentRoutingModule {}