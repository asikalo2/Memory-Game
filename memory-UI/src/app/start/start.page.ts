import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameService } from "../shared/game.service";

@Component({
  selector: "app-start",
  templateUrl: "./start.page.html",
  styleUrls: ["./start.page.scss"]
})
export class StartPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  startGame() {
    this.router.navigate(["/level"]);
  }

  joinGame() {
    this.router.navigate(["/join-key"]);
  }
}
