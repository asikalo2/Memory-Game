import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user = new User;

  constructor() { }

  setUsername(username: string) {


    this.user.username = username;
    
    console.log(this.user);
  }
 
  setLevelType(levelType: number) {

    this.user.levelType = levelType;

    console.log(this.user);
  }
  

}
