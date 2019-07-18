import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  constructor(private router: Router,  public _userService: UserService) { }

  ngOnInit() {
  }

  startGame(){
    this._userService.setGameType(1);
    this._userService.setCurrentPlayer(1);
    this.router.navigate(["/level"]);
  }
  
  joinGame(){
   console.log('join game');

  }
}
