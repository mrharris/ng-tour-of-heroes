import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html'
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];
  selectedHero: Hero;
  dialogRef: MdDialogRef<SelectedHeroDialog>;

  constructor(
    private heroService: HeroService,
    private router: Router,
    private dialog: MdDialog
  ) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  onSelect(hero: Hero): void {
    this.dialogRef = this.dialog.open(SelectedHeroDialog);
    this.dialogRef.componentInstance.selectedHero = hero;
    this.selectedHero = hero;
  }

  getHeroes(): void {
    this.heroService.getHeroes().then(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.create(name)
      .then(hero => {
        this.heroes.push(hero);
        this.selectedHero = null;
      });
  }

  // delegate hero deletion to the hero HeroService
  // but the component is still responsible for updating the display
  delete(hero: Hero): void {
    this.heroService
      .delete(hero.id)
      .then(() => {
        this.heroes = this.heroes.filter(h => h !== hero);
        if (this.selectedHero === hero) { this.selectedHero = null; }
      });
  }
}


@Component({
  selector: 'seleted-hero-dialog',
  template: `
  <h2>
    {{selectedHero.name | uppercase }} is my hero
  </h2>
  <button md-raised-button color="accent" (click)="gotoDetail()">View Details</button>
  <button md-raised-button (click)="dialogRef.close()">Close</button>
  `
})
export class SelectedHeroDialog {
  selectedHero: Hero;

  constructor(
    public dialogRef: MdDialogRef<SelectedHeroDialog>,
    private router: Router
  ) { }

  gotoDetail(): void {
    this.dialogRef.close();
    this.router.navigate(['/detail', this.selectedHero.id]);
  }
}