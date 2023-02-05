import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, map, Observable, OperatorFunction } from 'rxjs';
import { TermService } from 'src/app/company/templates/term/term.service';
import { TalentTerm, Term, TermType } from 'src/app/shared/model';
import { TalentTermAdd, TalentTermEdit, TalentTermService } from 'src/app/shared/services/talent-term.service';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'edit-talent-terms',
  templateUrl: './edit-talent-terms.component.html',
  styleUrls: ['./edit-talent-terms.component.scss']
})
export class EditTalentTermsComponent implements OnInit {

  editTalentTermsForm = new FormGroup({
    talentTermsFormArray: new FormArray([])
  });

  newTalentTermForm = new FormGroup({
    code: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required]),
    negotiable: new FormControl(true, [Validators.required])
  })

  showAddNewTalentTermForm = false;
  showSaveButton = false;

  @Input()
  talentTerms!: TalentTerm[];

  @Output()
  talentTermsChanged = new EventEmitter<TalentTerm[]>()

  terms: Term[] = [];
  selectedTermsMap = new Map<string, Term>();

  constructor(private modalService: NgbModal, private termService: TermService, private talentTermService: TalentTermService, private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.talentTerms.forEach(talentTerm => {
      this.pushToTalentTermsFormArray(talentTerm);
      this.selectedTermsMap.set(talentTerm.term.code, talentTerm.term);
      this.termService.findAvailableForSearch().subscribe(terms => {
        this.terms = terms.filter(term => !this.selectedTermsMap.has(term.code));
      });
    });
    if (this.talentTerms.length === 0) {
      this.termService.findAvailableForSearch().subscribe(terms => {
        this.terms = terms;
      });
    }
    this.editTalentTermsForm.valueChanges.subscribe(() => this.showSaveButton = true);
  }

  edit(newTalentTerms: TalentTermEdit[]) {
    newTalentTerms.forEach(talentTerm => talentTerm['code'] = this.terms.find(term => term.name === talentTerm.name)?.code ?? '');
    this.talentTermService.edit(newTalentTerms).subscribe(talentTerms => {
      this.toastService.show("", "Terms updated.");
      this.showSaveButton = false;
      this.talentTermsChanged.next(talentTerms);
    });
  }

  add(newTalentTerm: TalentTermAdd) {
    const term = this.terms.find(term => term.code === newTalentTerm.code);
    if (term?.type === 'BOOLEAN') {
      newTalentTerm.value = 'true';
    }
    this.talentTermService.add([newTalentTerm]).subscribe({
      next: result => {
        this.talentTerms.push(result[0]);
        this.pushToTalentTermsFormArray(result[0]);
        this.showSaveButton = false;
        this.newTalentTermForm.reset({code: '', value: '', negotiable: true});
        this.showAddNewTalentTermForm = false;
        this.toastService.show('', 'Added term.');
        if (term) {
          this.selectedTermsMap.set(newTalentTerm.code, term);
        }
        this.terms = this.terms.filter(t => t.code !== newTalentTerm.code);
      },
      error: error => this.toastService.error("", error.error.message)
    });
  }

  private pushToTalentTermsFormArray(talentTerm: TalentTerm): void {
    this.talentTermsFormArray.push(
      new FormGroup({
        id: new FormControl(talentTerm.id),
        value: new FormControl(talentTerm.value, [Validators.required]),
        negotiable: new FormControl(talentTerm.negotiable, [Validators.required])
      })
    );
  }

  close() {
    this.modalService.dismissAll();
  }

  searchTerms: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => 
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? [] : this.terms.map(term => term.name).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  

  removeTalentTerm(index: number): void {
    const id = this.talentTermsFormArray.at(index).get('id')?.value;
    this.talentTermService.remove(id).subscribe(() => {
      this.talentTermsFormArray.removeAt(index);
      this.showSaveButton = false;
      const code = this.talentTerms[index].term.code;
      let term = this.selectedTermsMap.get(code);
      if (term) {
        this.terms.push(term);
        this.selectedTermsMap.delete(code);
      }
      this.talentTerms.splice(index, 1);
      this.talentTermsChanged.emit(this.talentTerms);
      this.toastService.show('', 'Removed term.');
    });
  }

  getTermType(code: string): TermType | undefined {
    return this.terms.find(term => term.code === code)?.type;
  }

  selectTerm(event: any) {
    const code = event.value;
    const termType = this.getTermType(code);
    if (termType === 'BOOLEAN') {
      this.newTalentTermForm.controls['value']?.setValue(true);
    }
  }

  get talentTermsFormArray(): FormArray {
    return this.editTalentTermsForm.get('talentTermsFormArray') as FormArray;
  }

}
