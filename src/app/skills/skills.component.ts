import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  cSharpImage = `../../assets/images/CSharp.png`;
  jsImage = `../../assets/images/JS.png`;
  angularImage = `../../assets/images/Angular.png`;
  postgreImage = `../../assets/images/PostgreSQL.png`;

  cSharp = 80;
  js = 50;
  angular = 40;
  postgre = 70;

  constructor() { }

  ngOnInit(): void {
  }

}
