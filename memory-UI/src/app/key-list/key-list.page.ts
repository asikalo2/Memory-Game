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
    this.router.navigate(['/enter-code']);
  }
}
