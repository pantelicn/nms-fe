import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Position, Skill, Talent, TalentTerm } from "src/app/shared/model";
import { ToastService } from "src/app/shared/toast/toast.service";
import { TalentService } from "../talent.service";

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

  private readonly modalOptions: NgbModalOptions = {
    backdrop: true,
    backdropClass: 'customBackdrop',
    size: 'lg'
  };

  constructor(private talentService: TalentService, private modalService: NgbModal, private toastService: ToastService) {}

  ngOnInit(): void {
    this.talentService.getTalent().subscribe(talent => this.talent = talent);
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

  onSetAvailable(): void {
    this.talentService.updateAvailability(true).subscribe(() => {
      this.talent.available = true;
      this.toastService.show('You are available.', 'You can now be found in talent search results.');
    });
  }

  onSetUnavailable(): void {
    this.talentService.updateAvailability(true).subscribe(() => {
      this.talent.available = false;
      this.toastService.warning('You are unavailable.', 'You can no longer be found in talent search results.');
    });
  }

}