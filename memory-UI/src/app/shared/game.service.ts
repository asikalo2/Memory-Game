import { Injectable } from "@angular/core";
import { GameStart } from "../models/gameStart";
import { GameJoin } from "../models/gameJoin";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class GameService {
  public gameStarter: GameStart = new GameStart();
  public gameJoin: GameJoin = new GameJoin();
  public numberList: number[];
  public list: Observable<number[]>;
  constructor() {}

  setUsername(username: string) {
    this.gameStarter.username = username;
  }
  setGameProperties(rowsNumber: number, playerNumber: number) {
    this.gameStarter.rowsNumber = rowsNumber;
    this.gameStarter.playerNumber = playerNumber;
    console.log(this.gameStarter);
  }

  getNumberList(): Observable<number[]> {
    console.log('Pocetak funkc', this.gameStarter.rowsNumber);
    if (this.gameStarter.rowsNumber === 4) {
     let numbers = [4, 3, 6, 1, 3, 5, 8, 1, 7, 5, 8, 7, 6, 4, 2, 2];

      this.list = of(numbers);
      return this.list;
    } else if (this.gameStarter.rowsNumber === 6) {
      let numbers = [
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
        15
      ];
      this.list = of(numbers);
      return this.list;
    } else if (this.gameStarter.rowsNumber === 8) {
      this.numberList = [
        1,
        25,
        11,
        16,
        8,
        30,
        31,
        32,
        21,
        9,
        10,
        18,
        20,
        24,
        28,
        6,
        26,
        5,
        15,
        23,
        27,
        7,
        14,
        29,
        13,
        12,
        22,
        19,
        3,
        17,
        2,
        4,
        16,
        14,
        4,
        5,
        8,
        11,
        32,
        7,
        10,
        26,
        19,
        1,
        6,
        2,
        3,
        30,
        23,
        18,
        13,
        21,
        15,
        28,
        22,
        17,
        31,
        12,
        27,
        29,
        20,
        24,
        25,
        9
      ];
      this.list = of(this.numberList);
      return this.list;
    }
  }
}
