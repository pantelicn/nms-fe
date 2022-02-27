import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "src/app/shared/toast/toast.service";
import { AddPostService } from "./add-post.service";

@Component({
  selector: 'add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent {

  closeResult: string = '';
  modalOptions:NgbModalOptions;
  addPostForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
  });

  constructor(private modalService: NgbModal, 
              private addPostService: AddPostService,
              private toastService: ToastService) {
    this.modalOptions = {
      backdrop: true,
      backdropClass: 'customBackdrop'
    }
  }

  open(content: any) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {}, 
      () => {
        this.addPostForm.reset();
    });
  }

  onSubmit(): void {
    if (this.addPostForm.valid) {
      this.addPostService.addPost(this.addPostForm.value).subscribe(post => {
        this.onAddPostSuccess();
      });
    }
  }

  private onAddPostSuccess() {
    this.modalService.dismissAll();
    this.addPostForm.reset();
    this.toastService.show('', 'Post has been added.');
  }

  get title() {
    return this.addPostForm.get('title');
  }

  get content() {
    return this.addPostForm.get('content');
  }

}