import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../shared/game.service';

@Component({
  selector: 'app-key-list',
  templateUrl: './key-list.page.html',
  styleUrls: ['./key-list.page.scss'],
})
export class KeyListPage implements OnInit {

  myKey: string;
  playersKeys: string[];
  constructor(
    private router: Router
  ) {
    this.myKey = GameService.myKey;
    this.playersKeys = GameService.playersKeys;
  }

  ngOnInit() {
  
    console.log('my key: ' + GameService.myKey , 'userys keys:' + GameService.playersKeys);

    console.log('this.my key: ' + this.myKey , 'userys keys:' + this.playersKeys);

  }

  nextPage() {
    console.log(GameService.gameStarter);
  if(GameService.gameStarter.username !== '')
  {
    this.router.navigate(['/game']);
  }
  else{
    this.router.navigate(['/enter-code']);
  }
  
  }
}
