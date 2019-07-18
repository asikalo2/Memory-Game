import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../shared/user.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {


  private loginForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, public _userService: UserService) {


  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
    });
  }

  get f(): any {
    return this.loginForm.controls;
  }
  toStartPage() {

    if (this.loginForm.invalid) {
      return;
    }
   
    this._userService.setUsername(this.loginForm.get("username").value);

    console.log(this.loginForm.get("username").value);
    this.router.navigate(["/start"]);

  }


}
