import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameService } from "../shared/game.service";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";

@Component({
  selector: "app-level",
  templateUrl: "./level.page.html",
  styleUrls: ["./level.page.scss"]
})
export class LevelPage implements OnInit {
  gameForm: FormGroup;
  rowsNumber: number;
  playersNumber: number;

  constructor(
    private router: Router,
    public _gameService: GameService,
    private formBuilder: FormBuilder
  ) {
    this.gameForm = new FormGroup({
      selectDiff: new FormControl(2, [Validators.required]),
      selectPlayer: new FormControl(4, [Validators.required])
    });
  }

  ngOnInit() {
   
    

    // this.gameForm.get('selectDiff').valueChanges.subscribe(selectedOption => {
    //   this.rowsNumber = selectedOption;
    //   console.log(this.rowsNumber);

    // });

    // this.gameForm.get('playersNumber').valueChanges.subscribe(selectedOption => {
    //   this.playersNumber = selectedOption;
    //   console.log(this.playersNumber);
    // });
  }

  onSubmit() {
this.playersNumber = this.gameForm.get('selectPlayer').value;
this.rowsNumber = this.gameForm.get('selectDiff').value;

this._gameService.setGameProperties (this.rowsNumber, this.playersNumber);
this.router.navigate(['/key-list']);
  }

 
}
