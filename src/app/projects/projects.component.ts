import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  anketnikImage = 'assets/images/Anketnik.PNG';
  anketnikInfo = `This is Anketnik. Simple WebForms application for access database and operate with it.
   It provides a simple, but powerfull functionalities - update, view and delete ankets.
    Anketnik was built exclusive for a server of Minecraft to use by me, and my friends, to sort new players and interview them with comfort for ourselves.`;

  constructor() {}

  ngOnInit(): void {}
}
