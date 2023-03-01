import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Talent } from "src/app/shared/model";
import { ToastService } from "src/app/shared/toast/toast.service";
import { ProjectService } from "../project.service";

@Component({
  selector: 'add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {

  addProjectForm: FormGroup;
  @Input()
  talent!: Talent;
  currentDate?: any;

  constructor(private projectService: ProjectService,
              private modalService: NgbModal,
              private toastService: ToastService) {
    this.addProjectForm = new FormGroup({
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
  }

  add() {
    const createProjectBody = {
      description: this.addProjectForm.value.description,
      myRole: this.addProjectForm.value.myRole,
      technologiesUsed: this.addProjectForm.value.technologiesUsed,
      startDate: new Date(this.addProjectForm.value.startDate.year, this.addProjectForm.value.startDate.month - 1, this.addProjectForm.value.startDate.day),
      endDate: this.addProjectForm.value.endDate ? new Date(this.addProjectForm.value.endDate.year, this.addProjectForm.value.endDate.month - 1, this.addProjectForm.value.endDate.day) : null
    }
    this.projectService.create(createProjectBody).subscribe({
      next: response => {
        if (!this.talent.projects) {
          this.talent.projects = [];
        }
        this.talent.projects.push(response);
        this.toastService.show('', 'New project has been added to your work experience.');
        this.modalService.dismissAll();
      },
      error: error => {
        this.toastService.error('', 'Unable to add project to your work experience.');
      }
    })
  }

  close(): void {
    this.modalService.dismissAll();
  }

  get description() {
    return this.addProjectForm.get('description');
  }

  get technologiesUsed() {
    return this.addProjectForm.get('technologiesUsed');
  }

  get myRole() {
    return this.addProjectForm.get('myRole');
  }

  get startDate() {
    return this.addProjectForm.get('startDate');
  }

}