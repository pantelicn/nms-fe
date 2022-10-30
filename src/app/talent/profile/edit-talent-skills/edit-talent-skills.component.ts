import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SkillService } from 'src/app/shared/services/skill.service';
import { Skill } from 'src/app/shared/model';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'edit-talent-skills',
  templateUrl: './edit-talent-skills.component.html',
  styleUrls: ['./edit-talent-skills.component.scss']
})
export class EditTalentSkillsComponent implements OnInit {

  @Input()
  talentSkills!: Skill[];

  @Output()
  talentSkillsChanged = new EventEmitter<Skill[]>()

  skillCode = new FormControl('', [Validators.required]);

  skills: Skill[] = [];

  constructor(private modalService: NgbModal, private skillService: SkillService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.skillService.findAll().subscribe(skills => this.skills = skills);
  }

  add(code: string): void {
    this.skillService.add(code).subscribe(skill => {
      this.talentSkills.push(skill);
      this.talentSkillsChanged.emit(this.talentSkills);
      this.toastService.show('', 'Skill added.')
    });
  }

  close() {
    this.modalService.dismissAll();
  }

  remove(index: number): void {
    this.skillService.remove(this.talentSkills[index].code).subscribe(() => {
      this.talentSkills.splice(index, 1);
      this.talentSkillsChanged.emit(this.talentSkills);
      this.toastService.show('', 'Skill removed.')
    });
  }

}
