import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-level',
  templateUrl: './level.page.html',
  styleUrls: ['./level.page.scss'],
})
export class LevelPage implements OnInit {

  constructor(private router: Router,  public _userService: UserService) { }

  ngOnInit() {
  }
  
  startEasy(){
    this._userService.setLevelType(1);
  }

  startMedium(){
    this._userService.setLevelType(2);
  }

  startHard(){
    this._userService.setLevelType(3);
  }
}
