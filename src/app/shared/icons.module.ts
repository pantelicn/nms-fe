import { NgModule } from '@angular/core';
import { BootstrapIconsModule } from 'ng-bootstrap-icons';
import { Search, HandThumbsUp, PersonCircle, ChevronCompactDown, HouseDoorFill, PeopleFill, CardList, EnvelopeFill, PersonBoundingBox, BellFill, Calendar3 } from 'ng-bootstrap-icons/icons'


const icons = {
  Search,
  HandThumbsUp,
  PersonCircle,
  ChevronCompactDown,
  HouseDoorFill,
  PeopleFill,
  CardList,
  EnvelopeFill,
  PersonBoundingBox,
  BellFill,
  Calendar3
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
