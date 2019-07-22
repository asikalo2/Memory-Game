import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../shared/game.service';

@Component({
  selector: 'app-key-list',
  templateUrl: './key-list.page.html',
  styleUrls: ['./key-list.page.scss'],
})
export class KeyListPage implements OnInit {

  show1:boolean = true;
  show2:boolean = false;

  constructor(
    private router: Router
  ) {

  }

  ngOnInit() {

   
  }
  ngAfterViewInit(){
    var number=GameService.gameStarter.playerNumber;
    console.log('Game starter u keylist:', GameService.gameStarter);
    setTimeout(()=>{
      this.show1=false;
      this.show2=true;
      var el1 = document.querySelector('.first');
        var el2 = document.querySelector('.second');
        el1.innerHTML+='<p style="margin-left: 5%" >'+GameService.gameStarter.users[0].code+'</p>';
        for (let index = 1; index < number; index++) {
          el2.innerHTML+='<p style="margin-left: 5%" >Player '+index +'  -  '+GameService.gameStarter.users[index].code+'</p>'
        }
      }, 5000);
  }
  nextPage() {
    console.log(GameService.gameStarter);
    if (GameService.gameStarter.username !== '') {
      this.router.navigate(['/game']);
    }
    else {
      this.router.navigate(['/enter-code']);
    }

  }
}
