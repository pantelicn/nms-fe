import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompanyComponent } from "./company.component";
import { HomeComponent } from "./home/home.component";
import { RequestComponent } from "./request/request.component";
import { TemplatesComponent } from "./templates/templates.component";

const routes: Routes = [
  {
    path: '',
    component: CompanyComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'requests', component: RequestComponent },
      { path: 'templates', component: TemplatesComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule {}