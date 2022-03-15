import { Component, Input, OnInit } from '@angular/core';
import { LinkPreview, LinkPreviewService } from './link-preview.service';

@Component({
  selector: 'nms-link-preview',
  templateUrl: './link-preview.component.html',
  styleUrls: ['./link-preview.component.scss']
})
export class LinkPreviewComponent implements OnInit {

  @Input()
  url!: string;
  linkPreview!: LinkPreview;

  constructor(private linkPreviewService: LinkPreviewService) { }

  ngOnInit(): void {
    this.initLinkPreview();
  }

  private initLinkPreview(): void {
    if (this.isImage(this.url)) {
      this.linkPreview = {
        title: '',
        description: '',
        image: this.url,
        url: this.url
      };
    } else {
      this.linkPreviewService.getLinkPreview(this.url).subscribe(data => 
        this.linkPreview = data
      );
    }
  }

  private isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

}
