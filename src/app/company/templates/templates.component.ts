import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModalRef, NgbModalOptions, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Code } from "ng-bootstrap-icons/icons";
import { City, Country, Skill } from "src/app/shared/model";
import { ToastService } from "src/app/shared/toast/toast.service";
import { PositionService, PositionView } from "../../shared/services/position.service";
import { SkillService } from "../../shared/services/skill.service";
import { AddTemplate, EditTemplate, Facet, TemplateService, TemplateView } from "./templates.service";
import { TermService, TermView } from "./term/term.service";
import { AvailableLocationSearch, FacetSpecifierDto } from "../talents/talents.service";
import { LocationService } from "src/app/shared/services/location.service";
import { Searchable, TypeaheadComponent } from "src/app/shared/components/typeahead/typeahead.component";

export interface Code {
  name: string,
  code: string,
  type? : string
}

@Component({
  selector: 'nms-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {

  addTemplateForm: FormGroup = this.fb.group({
    name: new FormControl('', [Validators.required]),
    facets: new FormArray([]),
    experienceYears: new FormControl(0, [Validators.min(0), Validators.max(99)])
  });;

  termTypes = [
    {
      "name": "Term",
      "value": "TERM"
    }
  ];

  operatorTypes = [
  {
    "name": "Less or equal",
    "value": "LTE"
  },
  {
    "name": "More or equal",
    "value": "GTE"
  }];

  positions: PositionView[] = [];

  skills: Skill[] = [];

  terms: TermView[] = [];

  codes: Map<number, Code[]> = new Map();

  templates: TemplateView[] = []

  submitted: boolean = false;

  selectedTemplateIndex: number = -1;

  availableLocations: AvailableLocationSearch[] = [];
  countries: Country[] = [];
  cities: City[] = [];
  selectedCountry: Country | null = null;
  selectedCities: City[] = [];
  selectedSkills: Skill[] = [];
  searchableSkills: Searchable[] = [];
  selectedPositions: PositionView[] = [];
  searchablePositions: Searchable[] = [];
  searchableCountries: Searchable[] = [];
  availableLocationMap = new Map<string, AvailableLocationSearch>();
  selectedCountryCitiesMap = new Map<string, Searchable[]>();
  showSpinnerExistingTemplates: boolean = true;

  @ViewChild(TypeaheadComponent) typeahead!: TypeaheadComponent;

  private modalRef?: NgbModalRef;

  modalOptions: NgbModalOptions = {
    backdrop: true,
    backdropClass: 'customBackdrop'
  };

  constructor(private fb:FormBuilder, 
              private skillService: SkillService,
              private positionService: PositionService,
              private templateService: TemplateService,
              private toastService: ToastService,
              private termService: TermService,
              private modalService: NgbModal,
              private locationService: LocationService) {
  }

  ngOnInit(): void {
    this.init();
  }

  private init() {
    this.initForm();
    this.initSkills();
    this.initPositions();
    this.initTerms();
    this.findAll();
    this.getCountries();
  }

  private initForm() {
    this.addTemplateForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      facets: new FormArray([]),
      experienceYears: new FormControl(0, [Validators.min(0), Validators.max(99)])
    });
  }

  findAll() {
    this.templateService.findAll().subscribe({
      next: response => {
        this.templates = response;
        this.showSpinnerExistingTemplates = false;
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
    })
  }

  private initTerms() {
    this.termService.findAvailableForSearch().subscribe(terms => {
      this.terms = terms;
    })
  }

  newFacet(): FormGroup {
    return new FormGroup({
      type: new FormControl('TERM', [Validators.required]),
      code: new FormControl('', [Validators.required])
    })
  }

  existingFacet(facet: Facet): FormGroup {
    let formGroup = new FormGroup({
      id: new FormControl(facet.id, [Validators.required]),
      type: new FormControl(facet.type, [Validators.required]),
      code: new FormControl(facet.code, [Validators.required]),
      operator: new FormControl(facet.operatorType, [Validators.required]),
      value: new FormControl(facet.value, [Validators.required])
    });
    if (facet.type === 'TERM') {
      formGroup.addControl('operatorType', new FormControl(facet.operatorType, [Validators.required]));
      formGroup.addControl('value', new FormControl(facet.operatorType, [Validators.required]));
    }
    return formGroup; 
  }

  addTerm() {
    this.facets.push(this.newFacet());
    this.setCodes(this.facets.length - 1);
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

  onSubmit(): void {
    this.submitted = true;
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
    
    if (this.addTemplateForm.valid) {
      if (this.id === null) {
        let data: AddTemplate = {
          ...this.addTemplateForm.value,
          availableLocations: this.availableLocations
        };
        data.facets = [...data.facets, ...selectedSkills, ...selectedPositions];
        this.templateService.addTemplate(data).subscribe(newTemplate => {
          this.onTemplateAddSuccess(newTemplate);
        });
      } else {
        let data: EditTemplate = {
          ...this.addTemplateForm.value,
          availableLocations: this.availableLocations
        };
        data.facets = [...data.facets, ...selectedSkills, ...selectedPositions];
        this.templateService.editTemplate(data).subscribe(modifiedTemplate => {
          this.onTemplateEditSuccess(modifiedTemplate);
        }); 
      }
      this.submitted = false;
    }
  }

  selectTemplate(selectedTemplate: TemplateView, index: number) {
    this.addTemplateForm = this.fb.group({
      id: new FormControl(selectedTemplate.id, [Validators.required]),
      name: new FormControl(selectedTemplate.name, [Validators.required]),
      facets: new FormArray([]),
      experienceYears: new FormControl(selectedTemplate.experienceYears, [Validators.min(0), Validators.max(99)])
    });
    this.availableLocations = selectedTemplate.availableLocations;
    this.availableLocationMap = new Map();
    this.availableLocations.filter(availableLocation => {
      this.availableLocationMap.set(availableLocation.country, availableLocation);
    });
    this.getCountries();
    
    const talentSkillsMap = new Map(this.templates[index].facets
      .filter(facet => facet.type === 'SKILL')
      .map((obj) => [obj.code, obj.code]));
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

    const talentPositionsMap = new Map(this.templates[index].facets
      .filter(facet => facet.type === 'POSITION')
      .map((obj) => [obj.code, obj.code]));
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

    let termFacets = selectedTemplate.facets.filter(facet => facet.type === 'TERM');
    for (let i = 0; i < termFacets.length ; i++) {
      let facet = termFacets[i];
      let facetGroup = this.existingFacet(facet);
      this.facets.push(facetGroup);
      this.setCodes(i);
      const codeDetail = this.codes.get(i)?.find(({code}) => code === facetGroup.get('code')?.value);
      (this.facets.at(i) as FormGroup).addControl('codeType', new FormControl(codeDetail?.type, []));
      
    }

    this.setSelectedCountriesWithCities();

    this.selectedTemplateIndex = index;
  }

  clearSelected() {
    this.availableLocations = [];
    this.availableLocationMap = new Map();
    this.getCountries();
    this.selectedSkills.forEach(selectedSkill => {
      this.searchableSkills.push({
          searchTerm: selectedSkill.name,
          object: selectedSkill
      })
    });
    this.selectedSkills = [];
    this.selectedPositions.forEach(selectedPosition => {
      this.searchablePositions.push({
          searchTerm: selectedPosition.name,
          object: selectedPosition
      })
    });
    this.selectedPositions = [];
    this.selectedTemplateIndex = -1;
    this.addTemplateForm.reset();
    this.facets.clear();
    this.initForm();
  }

  private onTemplateAddSuccess(newTemplate: TemplateView) {
    this.availableLocations = [];
    this.templates.push(newTemplate);
    this.addTemplateForm.reset();
    this.facets.clear();
    this.initForm();
    this.selectedSkills.forEach(selectedSkill => {
      this.searchableSkills.push({
          searchTerm: selectedSkill.name,
          object: selectedSkill
      })
    })
    this.selectedSkills = [];
    this.selectedPositions.forEach(selectedPosition => {
      this.searchablePositions.push({
          searchTerm: selectedPosition.name,
          object: selectedPosition
      })
    })
    this.selectedPositions = [];
    this.getCountries();
    this.toastService.show('', 'New template has been added.');
  }

  private onTemplateEditSuccess(modifiedTemplate: TemplateView) {
    this.templates[this.selectedTemplateIndex] = modifiedTemplate;
    this.clearSelected();
    this.selectedSkills.forEach(selectedSkill => {
      this.searchableSkills.push({
          searchTerm: selectedSkill.name,
          object: selectedSkill
      })
    })
    this.selectedSkills = [];
    this.selectedPositions.forEach(selectedPosition => {
      this.searchablePositions.push({
          searchTerm: selectedPosition.name,
          object: selectedPosition
      })
    })
    this.selectedPositions = [];
    this.getCountries();
    this.toastService.show('', 'New template has been added.');
  }

  setCodes(index: number) {
    const codes:Code[] = [];
    this.terms.forEach(term => codes.push(this.newCode(term.name, term.code, term.type)));

    this.codes.set(index, codes);
  }

  openRemoveTemplateDialog(content: any) {
    this.modalRef = this.modalService.open(content, this.modalOptions);
  }

  removeTemplate() {
    this.templateService.removeTemplate(this.id?.value).subscribe(success => {   
      this.toastService.show('', 'Template ' + this.name?.value + ' has been removed.');
      this.templates.splice(this.selectedTemplateIndex, 1);
      this.clearSelected();
      this.modalRef?.close();
    });
  }

  private addValueAndOperatorTypeControlls(index: number) {
    (this.facets.at(index) as FormGroup).addControl('value', new FormControl('', [Validators.required]));
    (this.facets.at(index) as FormGroup).addControl('operatorType', new FormControl('', [Validators.required]));
  }

  newCode(name: string, code: string, type?: string) {
    return {
      'name': name,
      'code': code,
      'type': type
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

  get id() {
    return this.addTemplateForm.get('id');
  }

  get name() {
    return this.addTemplateForm.get('name');
  }

  get facets() {
    return this.addTemplateForm.get('facets') as FormArray;
  }

  getPlaceholderText(termTypeValue: string): string {
    return 'Select term';
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

  addSkill(skill: Skill): void {
    this.selectedSkills.push(skill);
    this.searchableSkills = this.searchableSkills.filter(searchableSkill => searchableSkill.searchTerm !== skill.name);
  }

  addPosition(position: PositionView): void {
    this.selectedPositions.push(position);
    this.searchablePositions = this.searchablePositions.filter(searchablePosition => searchablePosition.searchTerm !== position.name);
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