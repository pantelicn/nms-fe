import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SkillService } from 'src/app/shared/services/skill.service';
import { Skill } from 'src/app/shared/model';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { Searchable } from 'src/app/shared/components/typeahead/typeahead.component';

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
  searchableSkills: Searchable[] = [];

  constructor(private modalService: NgbModal, private skillService: SkillService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.skillService.findAll().subscribe(skills => {
      const talentSkillsMap = new Map(this.talentSkills.map((obj) => [obj.code, obj]));
      this.searchableSkills = skills.filter(skill => talentSkillsMap.get(skill.code) === undefined).map(skill => {
        return {
          searchTerm: skill.name,
          object: skill
        }
      });
    });
  }

  add(skill: Skill): void {
    this.skillService.add(skill.code).subscribe({
      next: skill => {
        this.talentSkills.push(skill);
        this.searchableSkills = this.searchableSkills.filter(searchableSkill => searchableSkill.searchTerm !== skill.name);
        this.talentSkillsChanged.emit(this.talentSkills);
        this.toastService.show('', 'Skill added.')
      },
      error: error => this.toastService.error("", error.error.message)
    });
  }

  close() {
    this.modalService.dismissAll();
  }

  remove(index: number): void {
    this.skillService.remove(this.talentSkills[index].code).subscribe(() => {
      this.searchableSkills.push({
        searchTerm: this.talentSkills[index].name,
        object: this.talentSkills[index]
      });
      this.talentSkills.splice(index, 1);
      this.talentSkillsChanged.emit(this.talentSkills);
      this.toastService.show('', 'Skill removed.')
    });
  }

}
