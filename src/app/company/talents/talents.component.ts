import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Skill } from "src/app/shared/model";
import { PositionService, PositionView } from "../templates/position/position.service";
import { SkillService } from "../../shared/services/skill.service";
import { Code } from "../templates/templates.component";
import { Facet, TemplateService, TemplateView } from "../templates/templates.service";
import { TermService, TermView } from "../templates/term/term.service";
import { SearchPageResponse, TalentService, TalentTermViewDto, TalentViewSearchDto } from "./talents.service";

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
  });
  positions: PositionView[] = [];
  skills: Skill[] = [];
  terms: TermView[] = [];
  codes: Map<number, Code[]> = new Map();
  private modalRef?: NgbModalRef;
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
  termTypes = [{
    "name": "Position",
    "value": "POSITION"
  },
  {
    "name": "Skill",
    "value": "SKILL"
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
              private modalService: NgbModal) {}

  ngOnInit(): void {
    this.findAll();
    this.initForm();
    this.initSkills();
    this.initPositions();
    this.initTerms();
  }

  findAll() {
    this.templateService.findAll().subscribe(data => {
      this.templates = data;
    });
  }

  private initSkills() {
    this.skillService.findAll().subscribe(skills => {
      this.skills = skills;
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
    });
    for (let i = 0; i < template.facets.length ; i++) {
      let facet = template.facets[i];
      let facetGroup = this.existingFacet(facet);
      this.facets.push(facetGroup);
      this.setCodes(facetGroup.get('type'), i);
      if (facetGroup.get('type')?.value === 'TERM') {
        const codeDetail = this.codes.get(i)?.find(({code}) => code === facetGroup.get('code')?.value);
        (this.facets.at(i) as FormGroup).addControl('codeType', new FormControl(codeDetail?.type, []));
      }
    }
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
    } else if (value.value === 'SKILL') {
      this.skills.forEach((skill => {
        codes.push(this.newCode(skill.name, skill.code));
      }));
      this.removeValueAndOperatorTypeControlls(index);
    } else if (value.value === 'TERM') {
      this.terms.forEach((term => {
        codes.push(this.newCode(term.name, term.code, term.type));
      }));
      //this.addValueAndOperatorTypeControlls(index);
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
    if (page === 0) {
      this.foundTalents = [];
    }
    this.talentService.find(this.searchTalentsForm.value.facets, page).subscribe({
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
    this.modalRef = this.modalService.open(content, this.modalOptions);
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
    });
    this.addFacet();
  }

  getPlaceholderText(termTypeValue: string): string {
    if (termTypeValue === 'POSITION') {
      return 'Select position';
    } else if (termTypeValue === 'TERM') {
      return 'Select term';
    } else {
      return 'Select skill';
    }
  }

  get foundFilteredTalents(): TalentViewSearchDto[] {
    return this.foundTalents.filter(talent => 
      !(talent.previousRequest && (talent.previousRequest.status === 'ACCEPTED' || talent.previousRequest.status === 'PENDING'))
    );
  }

}