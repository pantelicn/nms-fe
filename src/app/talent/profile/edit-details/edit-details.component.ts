import { AfterContentInit, AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TalentService } from 'src/app/company/talents/talents.service';
import { Searchable, TypeaheadComponent } from 'src/app/shared/components/typeahead/typeahead.component';
import { AvailableLocation, City, Country, Talent } from 'src/app/shared/model';
import { LocationService } from 'src/app/shared/services/location.service';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.scss']
})
export class EditDetailsComponent implements OnInit, AfterContentInit {

  constructor(private locationService: LocationService, private modalService: NgbModal, private talentService: TalentService, private toastService: ToastService) { }

  @Input()
  talent!: Talent;

  nameForm!: FormGroup 

  countries: Country[] = [];
  cities: City[] = [];
  selectedCountry!: Country | null;
  selectedCities: City[] = [];

  @ViewChild(TypeaheadComponent) typeahead!: TypeaheadComponent;

  ngOnInit(): void {
    this.resetCountries();
  }

  ngAfterContentInit(): void {
    this.nameForm = new FormGroup({
      firstName: new FormControl(this.talent.firstName, [Validators.required]),
      lastName: new FormControl(this.talent.lastName, [Validators.required])
    });
  }

  resetCountries(): void {
    this.locationService.getCountries().subscribe(countries => this.countries = countries);
  }

  get searchableCountries(): Searchable[] {
    return this.countries
      .filter(country => !this.talent?.availableLocations.map(availableLocation => availableLocation.country).includes(country.name))
      .map(country => {
        return {
          searchTerm: country.name,
          object: country
        }
      });
  }

  get searchableCities(): Searchable[] {
    return this.cities.map(city => {
      return {
        searchTerm: city.name,
        object: city
      }
    });
  }

  onSelectCountry(country: any): void {
    this.selectedCountry = country;
    this.locationService.getCities(country.id).subscribe(cities => this.cities = cities);
  }

  onSelectCity(city: any): void {
    this.selectedCities.push(city);
    this.cities.splice(this.cities.findIndex(c => city.name === c.name), 1);
    this.typeahead.reset();
  }

  close(): void {
    this.modalService.dismissAll();
  }

  addLocation(): void {
    if (this.selectedCountry) {
      this.talentService
        .addAvailableLocation(this.selectedCountry.name, this.selectedCities.map(city => city.name))
        .subscribe(talent => {
          this.countries.splice(this.countries.findIndex(c => c.name === this.selectedCountry?.name), 1);
          this.talent.availableLocations = talent.availableLocations;
          this.clearCountry();
        });
    }
  }

  removeLocation(availableLocation: AvailableLocation): void {
    this.talentService.removeAvailableLocation(availableLocation.id).subscribe(talent => {
      this.talent.availableLocations = talent.availableLocations;
      this.clearCountry();
      this.resetCountries();
    })
  }

  clearCountry(): void {
    this.selectedCities = [];
    this.selectedCountry = null;
  }

  clearCity(city: City): void {
    this.selectedCities.splice(this.selectedCities.findIndex(c => c.name === city.name));
  }

  onUpdateName(): void {
    const data = this.nameForm.value;
    this.talentService.updateBasicInfo(data).subscribe(talent => {
      this.talent.firstName = talent.firstName;
      this.talent.lastName = talent.lastName;
      this.nameForm.markAsPristine();
      this.toastService.show('', 'Updated basic info.');
    });
  }

}
