import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompanyComponent } from "./company.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  {
    path: '',
    component: CompanyComponent,
    children: [
      { path: '', component: HomeComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule {}