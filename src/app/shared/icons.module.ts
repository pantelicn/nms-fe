import { NgModule } from '@angular/core';
import { BootstrapIconsModule } from 'ng-bootstrap-icons';
import { Search, HandThumbsUp, PersonCircle, ChevronCompactDown } from 'ng-bootstrap-icons/icons'


const icons = {
  Search,
  HandThumbsUp,
  PersonCircle,
  ChevronCompactDown
}

@NgModule({
  imports: [
    BootstrapIconsModule.pick(icons)
  ],
  exports: [
    BootstrapIconsModule
  ]
})
export class IconsModule { }
