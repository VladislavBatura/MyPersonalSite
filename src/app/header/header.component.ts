import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  linkedin = `https://www.linkedin.com/in/vladislav-batura-b1277521a/`;
  facebook = `https://www.facebook.com/VladAviat0r/`;
  github = `https://github.com/VladislavBatura`;
  telegram = `https://t.me/Aviat0r`;
  home = `http://localhost:4200`;

  constructor() {}

  ngOnInit(): void {}
}
