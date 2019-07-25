import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameService } from "../shared/game.service";
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: "app-start",
  templateUrl: "./start.page.html",
  styleUrls: ["./start.page.scss"]
})
export class StartPage implements OnInit {
  private addressForm: FormGroup;

  private showAddress: boolean = false;
  constructor(private router: Router,    private snackBar: MatSnackBar,  private formBuilder: FormBuilder,) {
    this.addressForm = this.formBuilder.group({
      serverAddress: [""]
    });
  }

  ngOnInit() {}

  startGame() {
    this.router.navigate(["/level"]);
  }

  joinGame() {
    this.router.navigate(["/join-key"]);
  }

  showAddressInput(){
   this.showAddress = !this.showAddress;
  }

  saveAddress(){
    GameService.serverIPAddress = this.addressForm.get("serverAddress").value;
    console.log( this.addressForm.get("serverAddress").value);
    this.openSnackBar("Server address is successfuly added!","Done");
  }
  openSnackBar(message: string, description: string): void {
    this.snackBar.open(message, description, {
      duration: 2000
    });
  }
}
