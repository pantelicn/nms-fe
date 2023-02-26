import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { City, Country, Skill } from "src/app/shared/model";
import { PositionService, PositionView } from "../../shared/services/position.service";
import { SkillService } from "../../shared/services/skill.service";
import { Code } from "../templates/templates.component";
import { Facet, TemplateService, TemplateView } from "../templates/templates.service";
import { TermService, TermView } from "../templates/term/term.service";
import { AvailableLocationSearch, FacetSpecifierDto, SearchPageResponse, TalentService, TalentTermViewDto, TalentViewSearchDto } from "./talents.service";
import { Searchable, TypeaheadComponent } from "src/app/shared/components/typeahead/typeahead.component";
import { LocationService } from "src/app/shared/services/location.service";

@Component({
  selector: 'talents',
  templateUrl: './talents.component.html',
  styleUrls: ['./talents.component.scss']
})
export class TalentsComponent implements OnInit {

  searchResult?: SearchPageResponse;
  templates: TemplateView[] = [];
  selectedTemplate?: TemplateView;
  isLastPage: boolean = false;
  retrievingInProcess: boolean = false;
  currentPage: number = 0;
  searchTalentsForm: FormGroup = this.fb.group({
    facets: new FormArray([]),
    experienceYears: new FormControl(0, [Validators.min(0), Validators.max(99)])
  });
  positions: PositionView[] = [];
  skills: Skill[] = [];
  terms: TermView[] = [];
  codes: Map<number, Code[]> = new Map();
  countries: Country[] = [];
  cities: City[] = [];
  selectedCountry: Country | null = null;
  selectedCities: City[] = [];
  @ViewChild(TypeaheadComponent) typeahead!: TypeaheadComponent;
  modalOptions: NgbModalOptions = {
    backdrop: true,
    backdropClass: 'customBackdrop',
    size: 'xl'
  };
  showSpinnerPosts = false;
  selectedTalent?: TalentViewSearchDto;
  negotiableTerms: TalentTermViewDto[] = [];
  nonNegotiableTerms: TalentTermViewDto[] = [];
  noFoundTalents: boolean = false;
  foundTalents: TalentViewSearchDto[] = [];
  selectedTalentIndex: number = -1;
  selectedSkills: Skill[] = [];
  searchableSkills: Searchable[] = [];
  selectedPositions: PositionView[] = [];
  searchablePositions: Searchable[] = [];
  searchableCountries: Searchable[] = [];
  availableLocationMap = new Map<string, AvailableLocationSearch>();
  selectedCountryCitiesMap = new Map<string, Searchable[]>();
  availableLocations: AvailableLocationSearch[] = [];
  showSpinnerExistingTemplates: boolean = true;
  termTypes = [
  {
    "name": "Term",
    "value": "TERM"
  }];
  operatorTypes = [
  {
    "name": "Less or equal",
    "value": "LTE"
  },
  {
    "name": "More or equal",
    "value": "GTE"
  }];

  constructor(private templateService: TemplateService,
              private fb:FormBuilder, 
              private skillService: SkillService,
              private positionService: PositionService,
              private termService: TermService, 
              private talentService: TalentService,
              private modalService: NgbModal,
              private locationService: LocationService) {}

  ngOnInit(): void {
    this.findAll();
    this.initForm();
    this.initSkills();
    this.initPositions();
    this.initTerms();
    this.getCountries();
  }

  findAll() {
    this.templateService.findAll().subscribe({
      next: response => {
        this.showSpinnerExistingTemplates = false;
        this.templates = response;
      },
      error: error => {
        this.showSpinnerExistingTemplates = false;
      }
    });
  }

  private initSkills() {
    this.skillService.findAll().subscribe(skills => {
      this.skills = skills;
      this.searchableSkills = skills.map(skill => {
        return {
          searchTerm: skill.name,
          object: skill
        }
      });
    });
  }

  private initPositions() {
    this.positionService.findAll().subscribe(positions => {
      this.positions = positions;
      this.searchablePositions = positions.map(position => {
        return {
          searchTerm: position.name,
          object: position
        }
      });
    });
  }

  private initTerms() {
    this.termService.findAvailableForSearch().subscribe(terms => {
      this.terms = terms;
    })
  }

  selectTemplate(template: TemplateView) {
    this.searchTalentsForm = this.fb.group({
      facets: new FormArray([]),
      experienceYears: new FormControl(template.experienceYears, [Validators.min(0), Validators.max(99)])
    });
    this.availableLocations = template.availableLocations;
    this.availableLocationMap = new Map();
    this.availableLocations.filter(availableLocation => {
      this.availableLocationMap.set(availableLocation.country, availableLocation);
    });
    this.getCountries();
    let talentSkillsMap = new Map();
    let talentPositionsMap = new Map();
      
    for (let i = 0; i < template.facets.length ; i++) {
      let facet = template.facets[i];
      if (facet.type === 'TERM') {
        let facetGroup = this.existingFacet(facet);
        this.facets.push(facetGroup);
        this.setCodes(i);
        if (facetGroup.get('type')?.value === 'TERM') {
          const codeDetail = this.codes.get(i)?.find(({code}) => code === facetGroup.get('code')?.value);
          (this.facets.at(i) as FormGroup).addControl('codeType', new FormControl(codeDetail?.type, []));
        }
      } else if (facet.type === 'SKILL') {
        talentSkillsMap.set(template.facets[i].code, template.facets[i].code);
      } else {
        talentPositionsMap.set(template.facets[i].code, template.facets[i].code);
      }
    }
    
    this.selectedSkills = [];
    this.searchableSkills = this.skills.filter(skill => {
      if (talentSkillsMap.get(skill.code) === undefined) {
        return true;
      } else {
        this.selectedSkills.push(skill);
        return false;
      }
      }).map(skill => {
        return {
          searchTerm: skill.name,
          object: skill
        }
    });

    this.selectedPositions = [];
    this.searchablePositions = this.positions.filter(position => {
      if (talentPositionsMap.get(position.code) === undefined) {
        return true;
      } else {
        this.selectedPositions.push(position);
        return false;
      }
      }).map(position => {
        return {
          searchTerm: position.name,
          object: position
        }
    });

    this.selectedTemplate = template;
  }

  existingFacet(facet: Facet): FormGroup {
    let formGroup = new FormGroup({
      id: new FormControl(facet.id, [Validators.required]),
      type: new FormControl(facet.type, [Validators.required]),
      code: new FormControl(facet.code, [Validators.required]),
      operatorType: new FormControl(facet.operatorType, [Validators.required]),
      value: new FormControl(facet.value, [Validators.required])
    });
    if (facet.type === 'TERM') {
      formGroup.addControl('operatorType', new FormControl(facet.operatorType, [Validators.required]));
      formGroup.addControl('value', new FormControl(facet.operatorType, [Validators.required]));
    }
    return formGroup; 
  }

  setCodes(index: number) {
    const codes:Code[] = [];
    this.terms.forEach((term => {
      codes.push(this.newCode(term.name, term.code, term.type));
    }));

    this.codes.set(index, codes);
  }

  newCode(name: string, code: string, type?: string) {
    return {
      'name': name,
      'code': code,
      'type': type
    }
  }

  removeFacet(index:number) {
    this.facets.removeAt(index);
    this.codes.delete(index);
    for (let i = index; i < this.codes.size; i++) {
        const code = this.codes.get(i + 1);
        if (code) {
          this.codes.set(i, code);
        }
    }
  }

  setCodeType(selectedType: any, selectedCode: any, index: number) {
    if (selectedType.value === 'TERM') {
      const codeDetail = this.codes.get(index)?.find(({code}) => code === selectedCode.value);
      (this.facets.at(index) as FormGroup).removeControl('codeType');
      (this.facets.at(index) as FormGroup).addControl('codeType', new FormControl(codeDetail?.type, []));
      if (codeDetail?.type != 'BOOLEAN') {
        this.addValueAndOperatorTypeControlls(index);
      }
    }
  }

  addTerm() {
    this.facets.push(this.newFacet());
    this.setCodes(this.facets.length - 1);
  }

  newFacet(): FormGroup {
    return new FormGroup({
      type: new FormControl('TERM', [Validators.required]),
      code: new FormControl('', [Validators.required])
    })
  }

  clearSelected() {
    this.selectedTemplate = undefined;
    this.searchTalentsForm.reset();
    this.availableLocations = [];
    this.availableLocationMap = new Map();
    this.getCountries();
    this.facets.clear();
    this.selectedSkills.forEach(selectedSkill => {
      this.searchableSkills.push({
          searchTerm: selectedSkill.name,
          object: selectedSkill
      })
    })
    this.selectedSkills = [];
    this.selectedPositions = [];
    this.initForm();
  }

  search(page: number) {
    if (page === 0) {
      this.foundTalents = [];
    }

    let selectedSkills: FacetSpecifierDto[] = []; 
    this.selectedSkills.forEach(selectedSkill => selectedSkills.push({
      code: selectedSkill.code,
      operatorType: 'EQ',
      type: 'SKILL',
      value: selectedSkill.code
    }));
    let selectedPositions: FacetSpecifierDto[] = []; 
    this.selectedPositions.forEach(selectedPosition => selectedPositions.push({
      code: selectedPosition.code,
      operatorType: 'EQ',
      type: 'POSITION',
      value: selectedPosition.code
    }));
    let formValue = this.searchTalentsForm.value;
    const facets = [...formValue.facets, ...selectedSkills, ...selectedPositions];
    this.talentService.find(facets, formValue.experienceYears, this.availableLocations, page).subscribe({
      next: response => {
        this.searchResult = response;
        this.foundTalents.push(...response.content);
        this.noFoundTalents = this.foundFilteredTalents.length === 0;
        this.currentPage = response.number;
        this.isLastPage = response.last;
        this.retrievingInProcess = false;
        this.showSpinnerPosts = false;
      },
      error: () => {
        this.retrievingInProcess = false;
      }
    });
  }

  openSendRequestDialog(talent: TalentViewSearchDto, content: any, index: number) {
    this.selectedTalent = talent;
    this.negotiableTerms = [];
    this.nonNegotiableTerms = [];
    this.selectedTalentIndex = index;
    talent.terms.forEach(term => {
      if (term.negotiable) {
        this.negotiableTerms.push(term);
      } else {
        this.nonNegotiableTerms.push(term);
      }
    });
    this.modalService.open(content, this.modalOptions);
  }

  getNextTalents() {
    if (this.isLastPage || this.retrievingInProcess) {
      return;
    }
    this.retrievingInProcess = true;
    this.currentPage++;
    this.search(this.currentPage);
  }

  requestSent() {
    this.foundTalents[this.selectedTalentIndex].requestSent = true;
  }

  get facets() {
    return this.searchTalentsForm.get('facets') as FormArray;
  }

  private removeValueAndOperatorTypeControlls(index: number) {
    (this.facets.at(index) as FormGroup).removeControl('value');
    (this.facets.at(index) as FormGroup).removeControl('operatorType');
  }

  private addValueAndOperatorTypeControlls(index: number) {
    (this.facets.at(index) as FormGroup).addControl('value', new FormControl('', [Validators.required]));
    (this.facets.at(index) as FormGroup).addControl('operatorType', new FormControl('', [Validators.required]));
  }

  private initForm() {
    this.searchTalentsForm = this.fb.group({
      facets: new FormArray([]),
      experienceYears: new FormControl(0, [Validators.min(0), Validators.max(99)])
    });
  }

  getPlaceholderText(termTypeValue: string): string {
    return 'Select term';
  }

  clearCity(city: City): void {
    this.selectedCities.splice(this.selectedCities.findIndex(c => c.name === city.name));
  }

  addSkill(skill: Skill): void {
      this.selectedSkills.push(skill);
      this.searchableSkills = this.searchableSkills.filter(searchableSkill => searchableSkill.searchTerm !== skill.name);
  }

  addPosition(position: PositionView): void {
    this.selectedPositions.push(position);
    this.searchablePositions = this.searchablePositions.filter(searchablePosition => searchablePosition.searchTerm !== position.name);
  }

  removeSkill(index: number): void {
      this.searchableSkills.push({
        searchTerm: this.selectedSkills[index].name,
        object: this.selectedSkills[index]
      });
      this.selectedSkills.splice(index, 1);
  }

  removePosition(index: number): void {
    this.searchablePositions.push({
      searchTerm: this.selectedPositions[index].name,
      object: this.selectedPositions[index]
    });
    this.selectedPositions.splice(index, 1);
  }

  get foundFilteredTalents(): TalentViewSearchDto[] {
    return this.foundTalents.filter(talent => 
      !(talent.previousRequest && (talent.previousRequest.status === 'ACCEPTED' || talent.previousRequest.status === 'PENDING'))
    );
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

  onSelectCountry(country: any): void {
    this.searchableCountries = this.searchableCountries.filter(sc => sc.searchTerm !== country.name);
    if (!this.availableLocations) {
      this.availableLocations = [];
    }
    this.availableLocations.push({
      country: country.name,
      cities: [],
      id: country.id
    })
    this.getCities(country.id, country.name); 
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

  onSelectCity(city: any, availableLocation: AvailableLocationSearch): void {
    availableLocation.cities.push(city);

    let found = this.selectedCountryCitiesMap.get(availableLocation.country);
    if (found) {
      found = found.filter(c => {
        return c.searchTerm !== city;
      });
      this.selectedCountryCitiesMap.set(availableLocation.country, found);
    }
  }

  removeAvailableCity(cityName: string, availableLocation: AvailableLocationSearch) {
    let availableCities = this.selectedCountryCitiesMap.get(availableLocation.country);
    if (availableCities) {
      availableCities.push({
        searchTerm: cityName,
        object: cityName
      })
    }
    availableLocation.cities = availableLocation.cities.filter(city => city !== cityName);
  }

  removeLocation(availableLocation: AvailableLocationSearch): void {
    this.availableLocations = this.availableLocations.filter(location => location.country !== availableLocation.country);
    this.searchableCountries.push({
      searchTerm: availableLocation.country,
      object: {
        name: availableLocation.country,
        id: availableLocation.id
      },
      id: availableLocation.id
    })   
  }

  setSelectedCountriesWithCities() {
    this.countries.filter(country => {
      let availableLocation = this.availableLocationMap.get(country.name);
      if (availableLocation && country.id) {
        availableLocation.id = country.id;
        this.getCities(country.id, country.name, availableLocation.cities);
      }
    })
  }

}