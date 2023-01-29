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

  constructor(private projectService: ProjectService,
    private modalService: NgbModal,
    private toastService: ToastService) {
    this.editProjectForm = new FormGroup({
      id: new FormControl(),
      description: new FormControl('', [Validators.required]),
      technologiesUsed: new FormControl('', [Validators.required]),
      myRole: new FormControl('', [Validators.required]),
      startDate: new FormControl(),
      endDate: new FormControl()
    });
  }

  ngOnInit(): void {
    this.fillForm();
  }

  edit() {
    this.projectService.edit(this.editProjectForm.value).subscribe({
      next: response => {
        this.project.description = response.description;
        this.project.myRole = response.myRole;
        this.project.technologiesUsed = response.technologiesUsed;
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

}