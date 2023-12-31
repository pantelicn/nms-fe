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
    for (let i = 0; i < this.talent.availableLocations.length && i < this.MAX_LOCATIONS; i++) {
      locations += this.talent.availableLocations[i].country + ', ';
    }
    locations = locations.slice(0, -2);
    if (this.talent.availableLocations.length > this.MAX_LOCATIONS) {
      locations += '...';
    }
    return locations;
  }

  get skills(): string[] {
    return this.talent.skills.map(skill => skill.name);
  }

  get positions(): string[] {
    return this.talent.positions.map(position => position.name);
  }

}
