import { Component, OnInit } from '@angular/core';
import { GameService } from '../shared/game.service';
import { Card } from '../models/card';
import { Game } from '../models/game';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  show: boolean = false;
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

  game: Game;
  constructor(public _gameService: GameService, private router: Router, private storage: Storage) {

  }

  ngOnInit() {
    // this.rows = GameService.gameStarter.rowsNumber;


    //this.getNumbers();
  }
  ngAfterViewInit() {
    this.storage.ready().then(() => {
      this.storage.get('game').then((val) => {
        let valJson = JSON.parse(val);
        console.log(JSON.parse(val));
        this.game = valJson;
        this.rows = valJson.rows;
        this.show = true;
        this.generateGrid();
      });
    })
    console.log('game page', this.game);
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

  generateGrid() {
    this.router.navigate(["/game"]);
    let num = this.game.rows * this.game.rows;
    for (let i = 0; i < num; i++) {
      const card = new Card();
      card.index = i;
      card.number = 1;
      card.icon = this.iconMap['' + 1];
      card.hidden = true;

      this.cardList.push(card);
    }
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
