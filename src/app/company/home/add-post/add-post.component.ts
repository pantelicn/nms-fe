import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Company, Post } from "src/app/shared/model";
import { ToastService } from "src/app/shared/toast/toast.service";
import { environment } from "src/environments/environment";
import { AddPostService } from "./add-post.service";

@Component({
  selector: 'nms-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent {

  closeResult: string = '';
  modalOptions: NgbModalOptions;
  addPostForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
  });
  @Input() company!: Company;
  @Input() remainingPosts!: number;
  @Output() postAddedChange = new EventEmitter<Post>();

  constructor(private modalService: NgbModal, 
              private addPostService: AddPostService,
              private toastService: ToastService) {
    this.modalOptions = {
      backdrop: true,
      backdropClass: 'customBackdrop'
    }
  }

  open(content: any) {
    this.modalService.open(content, this.modalOptions).result.then(
      () => { },
      () => this.addPostForm.reset()
    );
  }

  onSubmit(): void {
    if (this.addPostForm.valid) {
      this.addPostService.addPost(this.addPostForm.value).subscribe({
        next: response => {
          this.onAddPostSuccess(response);
        },
        error: error => {

        }
      }
      );
    }
  }

  private onAddPostSuccess(addedPost: Post) {
    this.postAddedChange.emit(addedPost);
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

  getImageUrl(profileImage: string): string {
    return environment.api.images + profileImage;
  }

}