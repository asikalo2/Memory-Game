import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../shared/game.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-key-list',
  templateUrl: './key-list.page.html',
  styleUrls: ['./key-list.page.scss'],
})
export class KeyListPage implements OnInit {

  show1: boolean = true;
  show2: boolean = false;

  constructor(
    private router: Router,
    public _gameService: GameService,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {


  }
  ngAfterViewInit() {
    var number = GameService.gameStarter.playerNumber;
    console.log('Game starter u keylist:', GameService.gameStarter);
    setTimeout(() => {
      this.show1 = false;
      this.show2 = true;
      var el1 = document.querySelector('.first');
      var el2 = document.querySelector('.second');
      el1.innerHTML += '<p style="margin-left: 5%" >' + GameService.gameStarter.users[0].code + '</p>';
      for (let index = 1; index < number; index++) {
        el2.innerHTML += '<p style="margin-left: 5%" >Player ' + index + '  -  ' + GameService.gameStarter.users[index].code + '</p>'
      }
    }, 2000);
  }
  nextPage() {
    console.log(GameService.gameStarter);
    if (GameService.gameStarter.username !== '') {
      var err = this._gameService.getGameCode(GameService.gameStarter.users[0].code).then(() => {
        this.router.navigate(['/game']);
      }).catch((err) => { console.log(err);
        this.openSnackBar("Error!", "User code is incorrect!");
      });
    } else {
      this.router.navigate(['/enter-code']);
    }
  }
  openSnackBar(message: string, description: string): void {
    this.snackBar.open(message, description, {
      duration: 10000
    });
  }
}
