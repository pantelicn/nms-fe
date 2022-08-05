import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "src/app/shared/toast/toast.service";
import { BenefitService, BenefitView } from "./benefits.service";

@Component({
  selector: 'edit-benefits',
  templateUrl: './edit-benefits.component.html',
  styleUrls: ['./edit-benefits.component.scss']
})
export class EditBenefitsComponent implements OnInit {
  
  editBenefitsForm = new FormGroup({
    benefitsFormArray: new FormArray([])
  });
  @Input() benefits?: BenefitView[];
  @Output() benefitsChanged = new EventEmitter<BenefitView[]>();

  constructor(private benefitService: BenefitService, 
              private modalService: NgbModal,
              private toastService: ToastService) {

  }

  ngOnInit(): void {
    this.benefits?.forEach(benefit => {
      this.benefitsFormArray.push(this.addExistingBenefitForm(benefit.name, benefit.description));
    });
  }

  edit(newBenefits: BenefitView[]) {
    this.benefitService.edit(newBenefits).subscribe(response => {
      this.benefitsChanged.emit(response);
      this.toastService.show('', 'Benefit are modified.');
      this.close();
    });
  }

  close() {
    this.modalService.dismissAll();
  }

  addNewBenefitForm() {
    this.benefitsFormArray.push(this.newBenefitForm());
  }

  removeBenefit(index: number) {
    this.benefitsFormArray.removeAt(index);
  }

  private addExistingBenefitForm(name: string, description: string): FormGroup {
    return new FormGroup({
      name: new FormControl(name, [Validators.required]),
      description: new FormControl(description, [Validators.required]),
      isDefault: new FormControl(true, [Validators.required])
    })
  }

  private newBenefitForm():FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      isDefault: new FormControl(true, [Validators.required])
    })
  }

  get benefitsFormArray() {
    return this.editBenefitsForm.get('benefitsFormArray') as FormArray;
  }

}