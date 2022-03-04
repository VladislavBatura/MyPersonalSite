import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  cSharp = 80;
  js = 40;
  angular = 20;
  postgre = 50;

  constructor() { }

  ngOnInit(): void {
  }

}
