import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit, OnDestroy {
  
  intervalId: any;
  counter: number = 5;
  private readonly TIME_INTERVAL_IN_SECONDS: number = 1000;

  constructor(private router: Router, 
              private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.intervalId = setInterval(()=> { 
      if (this.counter === 1) {
        const userType = this.activatedRoute.snapshot.queryParamMap.get('userType');
        this.router.navigate(['login'], {queryParams: {userType: userType}});
      }
      this.counter--;
    }, this.TIME_INTERVAL_IN_SECONDS);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

}