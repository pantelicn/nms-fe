import { Component, OnInit } from "@angular/core";
import { Talent } from "src/app/shared/model";
import { TalentService } from "../talent.service";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  talent?: Talent;

  constructor(private talentService: TalentService) {}

  ngOnInit(): void {
    this.initTalent();
  }

  private initTalent():void {
    this.talentService.getTalent().subscribe({
      next: response => {
        this.talent = response;
      },
      error: error => {

      }
    });
  }

}