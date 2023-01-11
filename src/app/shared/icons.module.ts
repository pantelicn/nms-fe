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
  GeoAltFill,
  Send,
  PlusCircle,
  XCircle,
  X,
  PencilSquare,
  Check,
  ArrowLeftShort,
  ArrowRightShort,
  ArrowClockwise,
  CheckAll,
  Envelope,
  Telephone,
  Link,
  Box,
  FilePost,
  Laptop,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Image,
  CloudArrowUpFill,
  Person,
  Plus,
  Dash,
  HandThumbsDown,
  Trash,
  List
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
  GeoAltFill,
  Send,
  PlusCircle,
  XCircle,
  X,
  PencilSquare,
  Check,
  ArrowRightShort,
  ArrowLeftShort,
  ArrowClockwise,
  CheckAll,
  Envelope,
  Telephone,
  Link,
  Box,
  FilePost,
  Laptop,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Image,
  CloudArrowUpFill,
  Person,
  Plus,
  Dash,
  HandThumbsDown,
  Trash,
  List
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
