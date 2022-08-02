import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ContactService, ContactView } from "src/app/shared/services/contact.service";
import { ToastService } from "src/app/shared/toast/toast.service";

@Component({
  selector: 'edit-contacts',
  templateUrl: './edit-contacts.component.html',
  styleUrls: ['./edit-contacts.component.scss']
})
export class EditContactsComponent implements OnInit {

  editContactsForm = new FormGroup({
    contactsFormArrayOld: new FormArray([]),
    contactsFormArrayNew: new FormArray([])
  });
  contactTypes = [{
    value: 'TELEPHONE',
    name: 'Telephone'
  },
  {
    value: 'URL',
    name: 'Link'
  },
  {
    value: 'EMAIL',
    name: 'eMail'
  }];
  @Input() contacts?: ContactView[];
  @Output() contactsChanged = new EventEmitter<ContactView[]>();

  constructor(private contactService: ContactService,
              private modalService: NgbModal,
              private toastService: ToastService) {}

  ngOnInit(): void {
    this.contacts?.forEach(contact => {
      this.contactsFormArrayOld.push(new FormGroup({
        id: new FormControl(contact.id, [Validators.required]),
        type: new FormControl(contact.type, [Validators.required]),
        value: new FormControl(contact.value, [Validators.required])
      }));
    });
  }

  close() {
    this.modalService.dismissAll();
  }

  edit(oldContacts: ContactView[], newContacs: ContactView[]) {
    const contacts = [...oldContacts, ...newContacs];
    this.contactService.edit(contacts).subscribe(response => {
      this.toastService.show('', 'Contacts has been updated.');
      this.contactsChanged.emit(response);
      this.close();
    });
  }

  addNewContactForm() {
    this.contactsFormArrayNew.push(this.newContactForm());
  }

  newContactForm():FormGroup {
    return new FormGroup({
      type: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required])
    })
  }

  removeOldContact(index: number) {
    this.contactsFormArrayOld.removeAt(index);
  }

  removeNewContact(index: number) {
    this.contactsFormArrayNew.removeAt(index);
  }

  get contactsFormArrayOld() {
    return this.editContactsForm.get('contactsFormArrayOld') as FormArray;
  }

  get contactsFormArrayNew() {
    return this.editContactsForm.get('contactsFormArrayNew') as FormArray;
  }

}