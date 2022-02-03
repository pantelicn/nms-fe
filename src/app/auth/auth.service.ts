import { Injectable } from '@angular/core';
import { User } from '../shared/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user!: User;

  constructor() { }

  get currentUser(): User {
    if (this.user) {
      return this.user;
    } else {
      // TODO: Retrieve user from api
      return {id:0, username:''};
    }
  }

  set currentUser(user: User) {
    this.currentUser = user;
  }

}
