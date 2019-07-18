import { Injectable } from '@angular/core';
import { GameStart } from '../models/gameStart';
import { GameJoin } from '../models/gameJoin';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public gameStarter: GameStart = new GameStart;
  public gameJoin: GameJoin = new GameJoin;

  constructor() { }

  setUsername(username: string) {
    this.gameStarter.username = username;
  }
  setGameProperties(rowsNumber: number, playerNumber: number) {
    this.gameStarter.rowsNumber = rowsNumber;
    this.gameStarter.playerNumber = playerNumber;
    console.log(this.gameStarter);
  }

}
