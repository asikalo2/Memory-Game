import { Injectable } from '@angular/core';
import { GameStart } from '../models/gameStart';
import { GameJoin } from '../models/gameJoin';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public gameStarter: GameStart = new GameStart;
  public gameJoin: GameJoin = new GameJoin;
  public numberList: number[];
  constructor() { }

  setUsername(username: string) {
    this.gameStarter.username = username;
  }
  setGameProperties(rowsNumber: number, playerNumber: number) {
    this.gameStarter.rowsNumber = rowsNumber;
    this.gameStarter.playerNumber = playerNumber;
    console.log(this.gameStarter);
  }

  getNumberList() {
    if (this.gameStarter.rowsNumber === 4) {
      return this.numberList = [
        4,
        3,
        6,
        1,
        3,
        5,
        8,
        1,
        7,
        5,
        8,
        7,
        6,
        4,
        2,
        2,
      ];
    }
    else if (this.gameStarter.rowsNumber === 6) {
      return this.numberList = [
        5,
        11,
        16,
        9,
        14,
        6,
        17,
        8,
        12,
        2,
        10,
        13,
        3,
        1,
        7,
        18,
        4,
        15,
        5,
        11,
        16,
        9,
        14,
        6,
        17,
        8,
        12,
        2,
        10,
        13,
        3,
        1,
        7,
        18,
        4,
        15,
      ];
    }

  }

}
