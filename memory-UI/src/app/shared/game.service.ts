import { Injectable } from "@angular/core";
import { GameStart } from "../models/gameStart";
import { GameJoin } from "../models/gameJoin";
import { Observable, of } from "rxjs";

import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { User } from "../models/user";
import { Game } from "../models/game";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root"
})
export class GameService {
  public static username: string;
  public static gameStarter: GameStart = new GameStart();
  public static isStarter: boolean = false;
  public static gameJoin: GameJoin = new GameJoin();
  public static game: Game = new Game();

  public numberList: number[];
  public list: Observable<number[]>;
  private serverUrl = "http://localhost:8080/ws";
  private stompClient;
  private connected: boolean = false;
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

  setGameProperties(
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

  

  getGameCode(userCode: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect({}, () => {
        this.stompClient.subscribe(
          "/topic/user" + userCode,
          payload => {
            var data = JSON.parse(payload.body);
            console.log(data);
            if (!data || data.gameCode === null) {
              reject();
            } else {
              this.stompClient.subscribe(
                "/topic/room" + data.gameCode,
                payload => {
                  var game = JSON.parse(payload.body);

                  GameService.game.rows = game.rows;
                  GameService.game.users = game.users;
                  this.storage.ready().then(() => {
                    this.storage
                      .set("game", JSON.stringify(GameService.game))
                      .then(value => {
                        console.log("game postavljeno", value);
                        resolve(true);
                      });
                  });
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
      this.storage.set("joinUser", JSON.stringify(GameService.gameJoin));

      console.log("Join player:", GameService.gameJoin);
      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect({}, () => {
        this.stompClient.subscribe(
          "/topic/user" + userCode,
          payload => {
            var data = JSON.parse(payload.body);
            console.log(data);
            if (!data || data.gameCode === null) {
              reject();
            } else {
              this.stompClient.subscribe(
                "/topic/room" + data.gameCode,
                payload => {
                  var game = JSON.parse(payload.body);

                  GameService.game.rows = game.rows;
                  GameService.game.users = game.users;
                  this.storage.set("game", JSON.stringify(GameService.game));

                  console.log("join game postavljeno", GameService.game);
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

  subscribeToGameStarter(gameCode) {
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe(
        "/topic/room" + gameCode,
        payload => {
          //konekcija na igru
        },
        error => {
          console.log("Subscribe: error: " + error);
        },
        () => {
          console.log("Subscribe, On complete");
        }
      );
      that.stompClient.send(
        "/app/memory/startGame",
        {},
        JSON.stringify({
          userCode: GameService.gameStarter.users[0].code,
          username: GameService.gameStarter.users[0].username
        })
      );
    });
  }

  //userCode, position
  getValueOfCards() {

  }
 
}
