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
  open1: boolean = false;
  open2: boolean = false;
 

  private iconMap = {
    "1": "basket", "2": "contract", "3": "expand", "4": "flashlight", "5": "happy", "6": "jet", "7": "planet", "8": "rose",
    "9": "pulse", "10": "rocket", "11": "heart", "12": "flash", "13": "add-circle", "14": "add-circle-outline", "15": "cafe", "16": "basketball",
    "17": "car", "18": "bus", "19": "hand", "20": "clock", "21": "heart-half", "22": "moon", "23": "paw", "24": "sad",
    "25": "school", "26": "star", "27": "logo-instagram", "28": "logo-youtube", "29": "logo-android", "30": "logo-apple", "31": "logo-facebook", "32": "logo-freebsd-devil",
  }

  game: Game;
  hideCodesButton: boolean = false;
  constructor(public _gameService: GameService, 
    private router: Router,
     private storage: Storage
     ) {

  }

  ngOnInit() {
   
  }
  ngAfterViewInit() {
    this.storage.ready().then(() => {
      this.storage.get('game').then((val) => {
        let valJson = JSON.parse(val);
        console.log(JSON.parse(val));
        this.game = valJson;
        this.rows = valJson.rows;
        this.show = true;
        this._gameService.generateGrid();
      });
      if (!GameService.isStarter) {
        console.log(GameService.gameJoin);
        this.hideCodesButton = true;
      }   
     });
    console.log('game page', this.game);
  }

  flipCard(card: Card) {
    if (!card.hidden) {
      console.log(card.hidden);
      return;
    } 
    else if (!GameService.isCurrentPlayer){
      {
        console.log("Ne moze "+ GameService.currentCode);
        return;
      }
    }
    this.storage.ready().then(() => {
      this.storage.get('joinUser').then((valString) => {
        let key = GameService.currentCode;
        let username = GameService.username;
        console.log(key + username);

        console.log("Poziv onClick");

    this._gameService.getValueOfCard(card.index);
   if(!this.open1){
    this.open1 = true;
   } else if (!this.open2 ){
      this.open2 = true;
   }
   
      });
    });

    let val = this._gameService.getCurrentValue(card.index).then((num) => {
      console.log("uslaa", num);
      card.icon = this.iconMap['' + num];
      
    }).catch((err) => { 
      console.log(err);
     
    });;
    
    
    
    //card.hidden = false;

    // ...
  }



 
}
