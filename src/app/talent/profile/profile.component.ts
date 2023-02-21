import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationDialog } from "src/app/shared/dialogs/confirmation/confirmation.component";
import { Position, Skill, Talent, TalentTerm } from "src/app/shared/model";
import { ToastService } from "src/app/shared/toast/toast.service";
import { TalentService } from "../talent.service";
import { ProjectService, ProjectView } from "./project.service";

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  talent!: Talent;
  talentTerms: TalentTerm[] = []; 
  talentPositions: Position[] = [];
  talentSkills: Skill[] = [];
  selectedProject!: ProjectView;
  loadingTalent: boolean = true;

  private readonly modalOptions: NgbModalOptions = {
    backdrop: true,
    backdropClass: 'customBackdrop',
    size: 'lg'
  };

  constructor(private talentService: TalentService, 
              private modalService: NgbModal, 
              private toastService: ToastService,
              private projectService: ProjectService) {}

  ngOnInit(): void {
    this.talentService.getTalent().subscribe({ 
      next: talent => {
        this.talent = talent;
        this.loadingTalent = false;
      },
      error: error => {
        this.loadingTalent = false;
      }
    });
    this.talentService.getTalentTerms().subscribe(talentTerms => this.talentTerms = talentTerms);
    this.talentService.getTalentPositions().subscribe(talentPositions => this.talentPositions = talentPositions);
    this.talentService.getTalentSkills().subscribe(talentSkills => this.talentSkills = talentSkills);
  }

  openDialog(content: any): void {
    this.modalService.open(content, this.modalOptions);
  }

  onTalentSkillsChange(event: Skill[]) {
    this.talentSkills = event;
    this.talentService.getTalentPositions().subscribe(talentPositions => this.talentPositions = talentPositions);
  }

  onTalentTermsChange(event: TalentTerm[]) {
    this.talentTerms = event;
  }

  onSetAvailable(): void {
    this.talentService.updateAvailability(true).subscribe(() => {
      this.talent.available = true;
      this.toastService.show('You are available.', 'You can now be found in talent search results.');
    });
  }

  onSetUnavailable(): void {
    this.talentService.updateAvailability(false).subscribe(() => {
      this.talent.available = false;
      this.toastService.warning('You are unavailable.', 'You can no longer be found in talent search results.');
    });
  }

  removeProject(projectId: number) {
    const modalRef = this.modalService.open(ConfirmationDialog);
    modalRef.componentInstance.message = 'Please confirm that you want to remove project from your work experience ?';
    modalRef.result.then(res => {
      if (!res) {
        return;
      }
      this.projectService.remove(projectId).subscribe({
        next: response => {
          this.talent.projects = this.talent.projects.filter(project => project.id !== projectId);
          this.toastService.show('', 'Project has been removed from your work experience!');
        },
        error: error => {

        }
      });
    }, dismiss => {
      
    });
  }

  editProject(project: ProjectView, dialogContent: any) {
    this.selectedProject = project;
    this.openDialog(dialogContent);
  }

}