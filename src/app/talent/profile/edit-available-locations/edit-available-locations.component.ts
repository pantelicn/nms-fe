import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TypeaheadComponent, Searchable } from "src/app/shared/components/typeahead/typeahead.component";
import { Country, AvailableLocation, Talent } from "src/app/shared/model";
import { LocationService } from "src/app/shared/services/location.service";
import { TalentService } from 'src/app/company/talents/talents.service';

@Component({
  selector: 'edit-available-locations',
  templateUrl: './edit-available-locations.component.html',
  styleUrls: ['./edit-available-locations.component.scss']
})
export class EditAvailableLocationsComponent implements OnInit {

  countries: Country[] = [];
  @Input()
  talent!: Talent;
  selectedCountryCitiesMap = new Map<string, Searchable[]>(); 
  availableLocationMap = new Map<string, AvailableLocation>();
  searchableCountries: Searchable[] = []

  @ViewChild(TypeaheadComponent) typeahead!: TypeaheadComponent;

  constructor(private modalService: NgbModal,
              private locationService: LocationService,
              private talentService: TalentService) {}

  ngOnInit(): void {
    this.talent.availableLocations.forEach(al => this.availableLocationMap.set(al.country, al));
    this.talent.availableLocations.forEach(al => {
      this.getCities(al.countryId, al.country, al.cities);
    })
    
    this.getCountries();
  }

  close(): void {
    this.modalService.dismissAll();
  }

  onSelectCountry(country: any): void {
    this.talentService
      .addAvailableLocation(country.name, country.id)
      .subscribe({
        next: availableLocation => {
          this.searchableCountries = this.searchableCountries.filter(sc => sc.searchTerm !== country.name);
          if (!this.talent.availableLocations) {
            this.talent.availableLocations = [];
          }
          if (!availableLocation.cities) {
            availableLocation.cities = [];
          }
          this.talent.availableLocations.push(availableLocation);
          this.getCities(country.id, country.name);
        },
        error: error => {

        }
      })
  }

  getCities(countryId: number, countryName: string, availableCities?: string[]) {
    this.locationService.getCities(countryId).subscribe(cities => {
      if (availableCities) {
        let searchableCitities = cities.filter(c => !availableCities.includes(c.name)).map(city => {
          return {
            searchTerm: city.name,
            object: city.name
          }
        });
        this.selectedCountryCitiesMap.set(countryName, searchableCitities);
      } else {
        let searchableCitities = cities.map(city => {
          return {
            searchTerm: city.name,
            object: city.name
          }
        });
        this.selectedCountryCitiesMap.set(countryName, searchableCitities);
      }
    });
  }

  onSelectCity(city: any, availableLocation: AvailableLocation): void {

    this.talentService.addAvailableCity(city, availableLocation.id).subscribe({
      next: response => {
        availableLocation.cities.push(city);

        let found = this.selectedCountryCitiesMap.get(availableLocation.country);
        if (found) {
          found = found.filter(c => {
            return c.searchTerm !== city;
          });
          this.selectedCountryCitiesMap.set(availableLocation.country, found);
        }
      },
      error: error => {

      }
    })
  }

  removeAvailableCity(cityName: string, availableLocation: AvailableLocation) {
    this.talentService.removeAvailableCity(cityName, availableLocation.id).subscribe({
      next: response => {
        let availableCities = this.selectedCountryCitiesMap.get(availableLocation.country);
        if (availableCities) {
          availableCities.push({
            searchTerm: cityName,
            object: cityName
          })
        }
        availableLocation.cities = availableLocation.cities.filter(city => city !== cityName);
      },
      error: error => {

      }
    })
  }

  removeLocation(availableLocation: AvailableLocation): void {
    this.talentService.removeAvailableLocation(availableLocation.id).subscribe({
      next: response => {
        this.talent.availableLocations = this.talent.availableLocations.filter(location => location.id !== availableLocation.id);
        this.searchableCountries.push({
          searchTerm: availableLocation.country,
          object: {
            name: availableLocation.country,
            id: availableLocation.countryId
          },
          id: availableLocation.countryId
        })
      },
      error: error => {

      }
    })
  }

  private getCountries() {
    this.locationService.getCountries().subscribe({
      next: response => {
        this.countries = response;
        this.initSearchableCountries();
      },
      error: error => {

      }
    })
  }

  initSearchableCountries() {
    this.searchableCountries = this.countries.filter(country => !this.availableLocationMap.has(country.name))
      .map(country => {
        return {
          searchTerm: country.name,
          object: country,
          id: country.id
        }
      });
  }

}