import { Component, OnInit } from '@angular/core';
import { GameService } from '../shared/game.service';
import { Card } from '../models/card';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
 rows: number;
 hidden: boolean = false;
 numberList: number[] = [];
 cardList: Card[] = [];

 private iconMap = {
  "1": "basket", "2": "contract", "3": "expand", "4": "flashlight", "5": "happy", "6": "jet", "7": "planet", "8": "rose",
  "9": "pulse", "10": "rocket", "11": "heart", "12": "flash", "13": "add-circle", "14": "add-circle-outline", "15": "cafe", "16": "basketball",
  "17": "car", "18": "bus", "19": "hand", "20": "clock", "21": "heart-half", "22": "moon", "23": "paw", "24": "sad",
  "25": "school", "26": "star", "27": "logo-instagram", "28": "logo-youtube", "29": "logo-android", "30": "logo-apple", "31": "logo-facebook", "32": "logo-freebsd-devil",
}

  constructor(public _gameService: GameService) { }

  ngOnInit() {
    this.rows = this._gameService.gameStarter.rowsNumber;
    this.getNumbers();
  }

  flipCard(card: Card) {
    if (!card.hidden) {
      console.log(card.hidden);
      return;
    }
    console.log(card.hidden);

    card.hidden = false;

    // ...
  }

  getNumbers() {
    this._gameService.getNumberList().subscribe(num => {
      this.numberList = num;
      console.log(this.numberList);
    });

    this.numberList.forEach((num, index) => {
      const card = new Card();
      card.index = index;
      card.number = num;
      card.icon = this.iconMap['' + num];
      card.hidden = true;

      this.cardList.push(card);
    });
    console.log(this.cardList);
    console.log(this.rows);
  }
}
