import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/shared/model/post.model';
import { Talent } from 'src/app/shared/model/talent.model';
import { FeedService } from './feed.service';

@Component({
  selector: 'nms-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  posts: Post[] = [];
  talents: Talent[] = [];

  constructor(private service: FeedService) { }

  ngOnInit(): void {
    this.service.getLatest10ByCountry('Serbia').subscribe(posts => this.posts = posts);
    // TODO: Add api call to fetch public feed talents and remove bellow test data
    this.talents = [
      {skills: ["Spring Boot", ".NET", "Angular"], positions: ["Backend", "Frontend"], availableLocations: [{city: "Novi Sad"}, {city: "Beograd"}, {city: "Subotica"}]},
      {skills: ["Kubernetes", "Docker"], positions: ["DevOps"], availableLocations: [{city: "Novi Sad"}, {city: "Beograd"}, {city: "Nis"}, {city: "Backi Jarak"}]},
      {skills: ["Linux", "Stuff"], positions: ["SysAdmin"], availableLocations: [{city: "Beograd"}, {city: "Amsterdam"}]}
    ];
  }

}
