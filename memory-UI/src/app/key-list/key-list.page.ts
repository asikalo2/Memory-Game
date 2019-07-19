import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../shared/game.service';

@Component({
  selector: 'app-key-list',
  templateUrl: './key-list.page.html',
  styleUrls: ['./key-list.page.scss'],
})
export class KeyListPage implements OnInit {

  
  constructor(
    private router: Router,
    public _gameService: GameService
  ) {}

  ngOnInit() {
  }

  nextPage() {
    console.log(this._gameService.gameStarter);
  if(this._gameService.gameStarter.username !== '')
  {
    this.router.navigate(['/game']);
  }
  else{
    this.router.navigate(['/enter-code']);
  }
  
  }
}
