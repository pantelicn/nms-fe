import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "src/app/shared/toast/toast.service";
import { ProjectService, ProjectView } from "../project.service";

@Component({
  selector: 'edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

  editProjectForm: FormGroup;
  @Input()
  project!: ProjectView;
  currentDate? : any;

  constructor(private projectService: ProjectService,
    private modalService: NgbModal,
    private toastService: ToastService) {
    this.editProjectForm = new FormGroup({
      id: new FormControl(),
      description: new FormControl('', [Validators.required]),
      technologiesUsed: new FormControl('', [Validators.required]),
      myRole: new FormControl('', [Validators.required]),
      startDate: new FormControl([Validators.required]),
      endDate: new FormControl()
    });
  }

  ngOnInit(): void {
    const currentDate = new Date();
    this.currentDate = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate()
    }
    this.fillForm();
  }

  edit() {
    const editProjectBody = {
      id: this.editProjectForm.value.id,
      description: this.editProjectForm.value.description,
      myRole: this.editProjectForm.value.myRole,
      technologiesUsed: this.editProjectForm.value.technologiesUsed,
      startDate: new Date(this.editProjectForm.value.startDate.year, this.editProjectForm.value.startDate.month - 1, this.editProjectForm.value.startDate.day),
      endDate: this.editProjectForm.value.endDate ? new Date(this.editProjectForm.value.endDate.year, this.editProjectForm.value.endDate.month - 1, this.editProjectForm.value.endDate.day) : null
    }
    this.projectService.edit(editProjectBody).subscribe({
      next: response => {
        this.project.description = response.description;
        this.project.myRole = response.myRole;
        this.project.technologiesUsed = response.technologiesUsed;
        this.project.startDate = response.startDate;
        this.project.endDate = response.endDate;
        this.toastService.show('', 'Project has been modified successfully.');
        this.modalService.dismissAll();
      },
      error: error => {
        this.toastService.error('', 'Unable to modify project !');
      }
    })
  }

  close(): void {
    this.modalService.dismissAll();
  }

  private fillForm() {
    this.editProjectForm.controls['id'].setValue(this.project.id);
    this.editProjectForm.controls['description'].setValue(this.project.description);
    this.editProjectForm.controls['technologiesUsed'].setValue(this.project.technologiesUsed);
    this.editProjectForm.controls['myRole'].setValue(this.project.myRole);
    const startDate: Date = new Date(this.project.startDate);
    this.editProjectForm.controls['startDate'].setValue({
      year: startDate.getFullYear(),
      month: startDate.getMonth() + 1,
      day: startDate.getDate()
    });
    const endDate: Date = new Date(this.project.endDate);
    if (this.project.endDate) {
      this.editProjectForm.controls['endDate'].setValue({
        year: endDate.getFullYear(),
        month: endDate.getMonth() + 1,
        day: endDate.getDate()
      });
    }
  }

  get description() {
    return this.editProjectForm.get('description');
  }

  get technologiesUsed() {
    return this.editProjectForm.get('technologiesUsed');
  }

  get myRole() {
    return this.editProjectForm.get('myRole');
  }

  get startDate() {
    return this.editProjectForm.get('startDate');
  }

  get endDate() {
    return this.editProjectForm.get('endDate');
  }

}