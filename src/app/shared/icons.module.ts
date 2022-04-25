import { NgModule } from '@angular/core';
import { BootstrapIconsModule } from 'ng-bootstrap-icons';
import { 
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
  Calendar3, 
  GeoAlt,
  PencilSquare,
  PlusCircle,
  XCircle,
  Check,
  ArrowLeftShort,
  ArrowRightShort,
  ArrowClockwise,
  CheckAll
} from 'ng-bootstrap-icons/icons';


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
  Calendar3,
  GeoAlt,
  PencilSquare,
  PlusCircle,
  XCircle,
  Check,
  ArrowRightShort,
  ArrowLeftShort,
  ArrowClockwise,
  CheckAll
};

@NgModule({
  imports: [
    BootstrapIconsModule.pick(icons)
  ],
  exports: [
    BootstrapIconsModule
  ]
})
export class IconsModule { }
