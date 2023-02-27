import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LinkType, NgxLinkifyjsService } from 'ngx-linkifyjs';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface LinkPreview {

  title: string;
  description: string;
  image: string;
  url: string;

}

@Injectable({
  providedIn: 'any'
})
export class LinkPreviewService {

  private readonly linkpreviewApi = environment.api.backend + 'link-preview';

  constructor(private http: HttpClient, private linkifyService: NgxLinkifyjsService) { }
  
  getLinkPreview(url: string): Observable<LinkPreview> {
    return this.http.post<LinkPreview>(this.linkpreviewApi, { url });
  }

  parseUrls(content: string): string[] {
    const links = this.linkifyService.find(content);
    return links.filter(link => link.type === LinkType.URL).map(link => link.href);
  }

}