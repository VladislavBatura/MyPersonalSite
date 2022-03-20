import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  creator = 'Vladislav Batura';
  email = 'batura.vlad@gmail.com';
  year = 2022;

  constructor() { }

  ngOnInit(): void {
  }

}
