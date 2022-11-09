import { Component, EventEmitter, Output } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { CompanyService } from "../../company.service";

@Component({
  selector: 'upload-profile-image',
  templateUrl: './upload-profile-image.component.html',
  styleUrls: ['./upload-profile-image.component.scss']
})
export class UploadProfileImageComponent {

  showSpinner: boolean = false;

  constructor(private modalService: NgbModal, 
              private companyService: CompanyService) {}

  imageChangedEvent: any = '';  
  croppedImage: any = '';  
  @Output() 
  profileImageChangedEvent = new EventEmitter<String>();
  
  fileChangeEvent(event: any): void {  
    this.imageChangedEvent = event;  
  }  
  imageCropped(event: ImageCroppedEvent) {  
    this.croppedImage = event.base64;  
  }  
  imageLoaded() {  
      /* show cropper */  
  }  
  cropperReady() {  
      /* cropper ready */  
  }  
  loadImageFailed() {  
      /* show message */  
  }  

  upload() {
    this.showSpinner = true;
    const profileImage = new File([this.dataURItoBlob(this.croppedImage)], "profileImage.png");;
    this.companyService.uploadProfileImage(profileImage).subscribe(response => {
      this.showSpinner = false;
      this.profileImageChangedEvent.emit(response.path);
      this.close();
    });
  }

  close() {
    this.modalService.dismissAll();
  }

  private dataURItoBlob(data: any): Blob {
    const byteString = atob(data.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });    
    return blob;
 }

}