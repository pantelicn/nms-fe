import { Component, OnInit } from '@angular/core';
import { Searchable } from 'src/app/shared/components/typeahead/typeahead.component';
import { City, Country } from 'src/app/shared/model';
import { LocationService } from 'src/app/shared/services/location.service';

@Component({
  selector: 'edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.scss']
})
export class EditDetailsComponent implements OnInit {

  constructor(private locationService: LocationService) { }

  countries: Country[] = [];
  cities: City[] = [];
  
  selectedCountry!: Country;

  ngOnInit(): void {
    this.locationService.getCountries().subscribe(countries => this.countries = countries);
  }

  get searchableCountries(): Searchable[] {
    return this.countries.map(country => {
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

  onSelectCountry(country: any):void {
    this.locationService.getCities(country.id).subscribe(cities => this.cities = cities);
  }

}
