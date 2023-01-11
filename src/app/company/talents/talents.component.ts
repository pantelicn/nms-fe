import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { City, Country, Skill } from "src/app/shared/model";
import { PositionService, PositionView } from "../templates/position/position.service";
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
  availableLocations: AvailableLocationSearch[] = [];
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
  termTypes = [{
    "name": "Position",
    "value": "POSITION"
  },
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
    this.initCountries();
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
    })
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
    for (let i = 0; i < template.facets.length ; i++) {
      let facet = template.facets[i];
      if (facet.type !== 'SKILL') {
        let facetGroup = this.existingFacet(facet);
        this.facets.push(facetGroup);
        this.setCodes(facetGroup.get('type'), i);
        if (facetGroup.get('type')?.value === 'TERM') {
          const codeDetail = this.codes.get(i)?.find(({code}) => code === facetGroup.get('code')?.value);
          (this.facets.at(i) as FormGroup).addControl('codeType', new FormControl(codeDetail?.type, []));
        }
      }
    }
    const talentSkillsMap = new Map(template.facets
      .filter(facet => facet.type === 'SKILL')
      .map((obj) => [obj.code, obj.code]));
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

  setCodes(value: any, index: number) {
    const codes:Code[] = [];
    if (value.value === 'POSITION') {
      this.positions.forEach((position => {
        codes.push(this.newCode(position.name, position.code));
      }));
      this.removeValueAndOperatorTypeControlls(index);
    } else if (value.value === 'TERM') {
      this.terms.forEach((term => {
        codes.push(this.newCode(term.name, term.code, term.type));
      }));
    }

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

  addFacet() {
    this.facets.push(this.newFacet());
  }

  newFacet(): FormGroup {
    return new FormGroup({
      type: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required])
    })
  }

  clearSelected() {
    this.selectedTemplate = undefined;
    this.searchTalentsForm.reset();
    this.facets.clear();
    this.initForm();
  }

  search(page: number) {
    this.addLocation();
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
    let formValue = this.searchTalentsForm.value;
    const facets = [...formValue.facets, ...selectedSkills];
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
    this.addFacet();
  }

  getPlaceholderText(termTypeValue: string): string {
    if (termTypeValue === 'POSITION') {
      return 'Select position';
    } else {
      return 'Select term';
    }
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

  addSkill(skill: Skill): void {
      this.selectedSkills.push(skill);
      this.searchableSkills = this.searchableSkills.filter(searchableSkill => searchableSkill.searchTerm !== skill.name);
  }

  removeSkill(index: number): void {
      this.searchableSkills.push({
        searchTerm: this.selectedSkills[index].name,
        object: this.selectedSkills[index]
      });
      this.selectedSkills.splice(index, 1);
  }

  get foundFilteredTalents(): TalentViewSearchDto[] {
    return this.foundTalents.filter(talent => 
      !(talent.previousRequest && (talent.previousRequest.status === 'ACCEPTED' || talent.previousRequest.status === 'PENDING'))
    );
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