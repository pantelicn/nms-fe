import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModalRef, NgbModalOptions, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Code } from "ng-bootstrap-icons/icons";
import { ToastService } from "src/app/shared/toast/toast.service";
import { PositionService, PositionView } from "./position/position.service";
import { SkillService, SkillView } from "./skill/skill.service";
import { Facet, TemplateService, TemplateView } from "./templates.service";
import { TermService, TermView } from "./term/term.service";

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
  });;

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
    }
  ];

  operatorTypes = [{
    "name": "Equal",
    "value": "EQ"
  },
  {
    "name": "Less than",
    "value": "LT"
  },
  {
    "name": "Less than or equal",
    "value": "LTE"
  },
  {
    "name": "Greater than",
    "value": "GT"
  },
  {
    "name": "Greater than or equal",
    "value": "GTE"
  }]

  positions: PositionView[] = [];

  skills: SkillView[] = [];

  terms: TermView[] = [];

  codes: Map<number, Code[]> = new Map();

  templates: TemplateView[] = []

  submitted: boolean = false;

  selectedTemplateIndex: number = -1;

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
              private modalService: NgbModal) {
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
  }

  private initForm() {
    this.addTemplateForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      facets: new FormArray([]),
    });
    this.addFacet();
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

  newFacet(): FormGroup {
    return new FormGroup({
      type: new FormControl('', [Validators.required]),
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

  addFacet() {
    this.facets.push(this.newFacet());
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
    if (this.addTemplateForm.valid && this.facets.length > 0) {
      if (this.id === null) {
        this.templateService.addTemplate(this.addTemplateForm.value).subscribe(newTemplate => {
          this.onTemplateAddSuccess(newTemplate);
        });
      } else {
        this.templateService.editTemplate(this.addTemplateForm.value).subscribe(modifiedTemplate => {
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
    });
    for (let i = 0; i < selectedTemplate.facets.length ; i++) {
      let facet = selectedTemplate.facets[i];
      let facetGroup = this.existingFacet(facet);
      this.facets.push(facetGroup);
      this.setCodes(facetGroup.get('type'), i);
      if (facetGroup.get('type')?.value === 'TERM') {
        const codeDetail = this.codes.get(i)?.find(({code}) => code === facetGroup.get('code')?.value);
        (this.facets.at(i) as FormGroup).addControl('codeType', new FormControl(codeDetail?.type, []));
      }
    }
    this.selectedTemplateIndex = index;
  }

  clearSelected() {
    this.selectedTemplateIndex = -1;
    this.addTemplateForm.reset();
    this.facets.clear();
    this.initForm();
  }

  private onTemplateAddSuccess(newTemplate: TemplateView) {
    this.templates.push(newTemplate);
    this.addTemplateForm.reset();
    this.facets.clear();
    this.initForm();
    this.toastService.show('', 'New template has been added.');
  }

  private onTemplateEditSuccess(modifiedTemplate: TemplateView) {
    this.templates[this.selectedTemplateIndex] = modifiedTemplate;
    this.clearSelected();
    this.toastService.show('', 'New template has been added.');
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
    }

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
    if (termTypeValue === 'POSITION') {
      return 'Select position';
    } else if (termTypeValue === 'TERM') {
      return 'Select term';
    } else {
      return 'Select skill';
    }
  }

}