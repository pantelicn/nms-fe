import { Component, Input } from '@angular/core';
import { Talent } from '../../model/talent.model';

@Component({
  selector: 'nms-talent',
  templateUrl: './talent.component.html',
  styleUrls: ['./talent.component.scss']
})
export class TalentComponent {

  @Input() talent!: Talent;

  isCollapsed = true;
  private readonly MAX_LOCATIONS = 3;

  constructor() { }

  get locations(): string {
    let locations = '';
    let i;
    for (i = 0; i < this.talent.availableLocations.length && i < this.MAX_LOCATIONS; i++) {
      locations += this.talent.availableLocations[i].city + ', ';
    }
    locations = locations.slice(0, -2);
    if (this.talent.availableLocations.length > this.MAX_LOCATIONS) {
      locations += '...';
    }
    return locations;
  }

}
