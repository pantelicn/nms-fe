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
    this.initCountries();
  }

  private initForm() {
    this.addTemplateForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      facets: new FormArray([]),
      experienceYears: new FormControl(0, [Validators.min(0), Validators.max(99)])
    });
  }

  findAll() {
    this.templateService.findAll().subscribe(data => {
      this.templates = data;
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
    this.addLocation();
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
    
    if (this.addTemplateForm.valid && this.facets.length > 0) {
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
        data.facets = [...data.facets, ...selectedSkills];
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
    for (let i = 0; i < selectedTemplate.facets.length ; i++) {
      if (selectedTemplate.facets[i].type === 'TERM') {
        let facet = selectedTemplate.facets[i];
        let facetGroup = this.existingFacet(facet);
        this.facets.push(facetGroup);
        this.setCodes(i);
        const codeDetail = this.codes.get(i)?.find(({code}) => code === facetGroup.get('code')?.value);
        (this.facets.at(i) as FormGroup).addControl('codeType', new FormControl(codeDetail?.type, []));
      }
      
    }
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
    this.selectedTemplateIndex = index;
  }

  clearSelected() {
    this.availableLocations = [];
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
    this.toastService.show('', 'New template has been added.');
  }

  setCodes(index: number) {
    const codes:Code[] = [];
    this.terms.forEach((term => {
      codes.push(this.newCode(term.name, term.code, term.type));
    }));

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

  private removeValueAndOperatorTypeControlls(index: number) {
    (this.facets.at(index) as FormGroup).removeControl('value');
    (this.facets.at(index) as FormGroup).removeControl('operatorType');
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

  initCountries(): void {
    this.locationService.getCountries().subscribe(countries => this.countries = countries);
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
  
  clearCountry(): void {
    this.selectedCities = [];
    this.selectedCountry = null;
  }
  
  addLocation(): void {
    if (this.selectedCountry) {
      this.countries.splice(this.countries.findIndex(c => c.name === this.selectedCountry?.name), 1);
      this.availableLocations.push({
        country: this.selectedCountry.name,
        cities: this.selectedCities.map(city => city.name)
      });
      this.clearCountry();
    }
  }

  removeLocation(availableLocation: AvailableLocationSearch): void {
      this.availableLocations.splice(this.availableLocations.findIndex(location => availableLocation.country === location.country));
      this.clearCountry();
      this.initCountries();
  }

  clearCity(city: City): void {
    this.selectedCities.splice(this.selectedCities.findIndex(c => c.name === city.name));
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

  get searchableCountries(): Searchable[] {
    return this.countries
      .filter(country => !this.availableLocations.map(availableLocation => availableLocation.country).includes(country.name))
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

}