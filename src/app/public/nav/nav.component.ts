import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OperatorFunction, Observable, debounceTime, map, catchError, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CompanyService } from 'src/app/company/company.service';
import { PublicCompanyService, PublicCompanyView } from 'src/app/shared/services/public-company.service';

@Component({
  selector: 'nms-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  searching: boolean = false;
  searchFailed: boolean = false;
  companyStartsWith: any;

  constructor(private authService: AuthService, 
              private publicCompanyService: PublicCompanyService,
    public router: Router) { }

  search: OperatorFunction<string, readonly PublicCompanyView[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => (this.searching = true)),
    switchMap((term) =>
      this.publicCompanyService.findByNameStartsWith(term, 0).pipe(
        tap(() => (this.searchFailed = false)),
        catchError(() => {
          this.searchFailed = true;
          return of([]);
        }),
      ),
    ),
    tap(() => (this.searching = false)),
  );

	formatter = (x: { name: string }) => x.name;
  
  openCompanyProfile(id: number) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['/companies/' + id]));
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  onLogout(): void {
    this.authService.logout();
  }

}
