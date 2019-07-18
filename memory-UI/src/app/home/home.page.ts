import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { GameService } from "../shared/game.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  private loginForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public _gameService: GameService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required]
    });
  }

  get f(): any {
    return this.loginForm.controls;
  }
  toStartPage() {
    if (this.loginForm.invalid) {
      return;
    }

    this._gameService.setUsername(this.loginForm.get("username").value);
    this.router.navigate(["/start"]);
  }
}
