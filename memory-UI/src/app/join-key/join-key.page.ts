import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '../shared/game.service';

@Component({
  selector: 'app-join-key',
  templateUrl: './join-key.page.html',
  styleUrls: ['./join-key.page.scss'],
})
export class JoinKeyPage implements OnInit {
  private joinKeyForm: FormGroup;

  constructor(
    private router: Router,
    public _gameService: GameService
  ) { 
    this.joinKeyForm = new FormGroup({
      code: new FormControl()
   });
  }

  ngOnInit() {
  }

}
