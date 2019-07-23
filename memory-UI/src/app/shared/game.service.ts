import { Injectable } from "@angular/core";
import { GameStart } from "../models/gameStart";
import { GameJoin } from "../models/gameJoin";
import { Observable, of } from "rxjs";

import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { User } from "../models/user";
import { Game } from "../models/game";
import { Storage } from "@ionic/storage";
import { Card } from '../models/card';

@Injectable({
  providedIn: "root"
})
export class GameService {
  public static username: string;
  public static gameStarter: GameStart = new GameStart();
  public static isStarter: boolean = false;
  public static gameJoin: GameJoin = new GameJoin();
  public static game: Game = new Game();
  public static currentCode: string;
  public static gameCode: string;
  public static isCurrentPlayer: boolean = false;

  public static currentCardValue: number;
  public static cardList: Card[] = [];

  public numberList: number[];
  public list: Observable<number[]>;
  private serverUrl = "http://localhost:8080/ws";
  private stompClient;
  private connected: boolean = false;

  private iconMap = {
    "1": "basket", "2": "contract", "3": "expand", "4": "flashlight", "5": "happy", "6": "jet", "7": "planet", "8": "rose",
    "9": "pulse", "10": "rocket", "11": "heart", "12": "flash", "13": "add-circle", "14": "add-circle-outline", "15": "cafe", "16": "basketball",
    "17": "car", "18": "bus", "19": "hand", "20": "clock", "21": "heart-half", "22": "moon", "23": "paw", "24": "sad",
    "25": "school", "26": "star", "27": "logo-instagram", "28": "logo-youtube", "29": "logo-android", "30": "logo-apple", "31": "logo-facebook", "32": "logo-freebsd-devil",
  }

  constructor(public storage: Storage) {
    this.initializeWebSocket();
  }
  initializeWebSocket() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
  }
  setUsername(username: string) {
    GameService.username = username;
  }

  createGame(
    rowsNumber: number,
    playerNumber: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      GameService.gameStarter.username = GameService.username;
      GameService.gameStarter.rowsNumber = rowsNumber;
      GameService.gameStarter.playerNumber = playerNumber;
      GameService.isStarter = true;
      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect({}, () => {

        // listen to new game
        this.stompClient.subscribe(
          "/topic/newGame",
          payload => {
            var game = JSON.parse(payload.body);

            for (let i = 0; i < game.users.length; i++) {
              let usr = new User(
                game.users[i].username,
                game.users[i].userCode,
                game.users[i].points
              );
              GameService.gameStarter.users.push(usr);
            }
            this.storage.set("startUser", JSON.stringify(GameService.gameStarter)).then(value => {
              console.log("startUser postavljeno", value);
              resolve(true);
            });

          },
          error => {
            console.log("Subscribe: error: " + error);
            reject();
          },
          () => {
            console.log("Subscribe, On complete");
            resolve(true);
          }
        );

        // create new game
        this.stompClient.send(
          "/app/memory/createGame",
          {},
          JSON.stringify({
            username: GameService.gameStarter.username,
            numberOfPlayers: playerNumber,
            rows: rowsNumber
          })
        );
      });
    });
  }


  getCards(): Card[] {
    return GameService.cardList;
  }

  getGameCode(userCode: string): Promise<boolean> {
    return new Promise((resolve, reject) => {

      //starter start game
      GameService.isCurrentPlayer=true;

      GameService.currentCode = userCode;
      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect({}, () => {
        this.stompClient.subscribe(
          "/topic/user" + userCode,
          payload => {
            var data = JSON.parse(payload.body);
            GameService.gameCode = data.gameCode;
            console.log(data);
            if (!data || data.gameCode === null) {
              reject();
            } else {
              this.stompClient.subscribe(
                "/topic/room" + data.gameCode,
                payload => {
                  this.handleGame(payload);
                  resolve(true);
                },
                error => {
                  console.log("Subscribe: error: " + error);
                  reject();
                },
                () => {
                  console.log("Subscribe, On complete");
                }
              );

              this.stompClient.send(
                "/app/memory/startGame",
                {},
                JSON.stringify({ gameCode: data.gameCode })
              );
            }
          },
          error => {
            console.log("Subscribe: error: " + error);
          },
          () => {
            console.log("Subscribe, On complete");
          }
        );

        this.stompClient.send(
          "/app/memory/findRoom",
          {},
          JSON.stringify({
            userCode: userCode,
            username: GameService.gameStarter.username
          })
        );
      });
    });
  }

  joinPlayer(userCode: string, username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      GameService.gameJoin.username = username;
      GameService.gameJoin.key = userCode;
      GameService.currentCode = userCode;
      this.storage.set("joinUser", JSON.stringify(GameService.gameJoin));

      console.log("Join player:", GameService.gameJoin);
      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect({}, () => {
        this.stompClient.subscribe(
          "/topic/user" + userCode,
          payload => {
            var data = JSON.parse(payload.body);
            GameService.gameCode = data.gameCode;
            console.log(data);
            if (!data || data.gameCode === null) {
              reject();
            } else {
              this.stompClient.subscribe(
                "/topic/room" + data.gameCode,
                payload => {
                  this.handleGame(payload);
                  resolve(true);
                },
                error => {
                  console.log("Subscribe: error: " + error);
                  reject();
                },
                () => {
                  console.log("Subscribe, On complete");
                }
              );
              this.stompClient.send(
                "/app/memory/startGame",
                {},
                JSON.stringify({ gameCode: data.gameCode })
              );
            }
          },
          error => {
            console.log("Subscribe: error: " + error);
          },
          () => {
            console.log("Subscribe, On complete");
          }
        );
        this.stompClient.send(
          "/app/memory/findRoom",
          {},
          JSON.stringify({ userCode: userCode, username: username })
        );
      });
    });
  }



  //userCode, position
  getValueOfCard(index: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect({}, () => {
        this.stompClient.send("/app/memory/sendMove",
          {},
          JSON.stringify({ userCode: GameService.currentCode, position: index })
        );


      });
    });
  }

  generateGrid() {
    let num = GameService.game.rows * GameService.game.rows;
    for (let i = 0; i < num; i++) {
      const card = new Card();
      card.index = i;
      card.number = 1;
      card.icon = 'hourglass';
      card.hidden = true;

      GameService.cardList.push(card);
    }
  }
  handleGame(payload) {
    this.storage.ready().then(() => {
      this.storage.set('joinUser', JSON.stringify(GameService.gameJoin)).then((value) => {
        console.log('game postavljeno', value);
        var game = JSON.parse(payload.body);
        if (game.rows) {
          var game = JSON.parse(payload.body);
          GameService.game.rows = game.rows;
          GameService.game.users = game.users;
          this.storage.ready().then(() => {
            this.storage
              .set("game", JSON.stringify(GameService.game))
              .then(value => {
                console.log("game postavljeno", value);

              });
          });
        } else if (game.cardValue) {
          console.log('card u subscibe', game);
          //GameService.cardList[game.cardIndex].number = JSON.parse(game.cardValue);
          //GameService.cardList[game.cardIndex].icon = this.iconMap['' + GameService.cardList[game.cardIndex].number];
          for (let i = 0; i < game.cards.length; i++) {
            if (game.cards[i].value != null) {
              GameService.cardList[i].hidden = false
              GameService.cardList[i].icon = this.iconMap['' + game.cards[i].value]
            }
            else {
              GameService.cardList[i].hidden = false
            }
          }
          GameService.currentCardValue = JSON.parse(game.cardValue);
          if( GameService.currentCode === game.nextPlayer.userCode) {
            GameService.isCurrentPlayer=true;
            console.log("prviii")
          }
          else {
            GameService.isCurrentPlayer=false;
          }
        }

      });
    });
  }

  getCurrentValue(index: number): Promise<number> {
    return new Promise((resolve, reject) => {

      var f = this.getValueOfCard(index).then(() => {
        console.log('card na kraju funkc', GameService.currentCardValue)
        resolve(GameService.currentCardValue);
      }).catch((err) => {
        console.log(err);
        reject();
      });




    });
  }
}
