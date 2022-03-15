import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxLinkifyjsService, LinkType } from 'ngx-linkifyjs';
import { Observable } from 'rxjs';

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

  private readonly linkpreviewApi = 'http://api.linkpreview.net';
  private readonly linkpreviewApiKey = 'd9f45dca3b0c366c21daafa68da69be7';

  constructor(private http: HttpClient, private linkifyService: NgxLinkifyjsService) { }
  
  getLinkPreview(url: string): Observable<LinkPreview> {
    const data = {
      key: this.linkpreviewApiKey,
      q: url
    };
    return this.http.post<LinkPreview>(this.linkpreviewApi, data);
  }

  parseUrls(content: string): string[] {
    const links = this.linkifyService.find(content);
    return links.filter(link => link.type === LinkType.URL).map(link => link.href);
  }

}