import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { HeroSearchService } from '../hero-search.service';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  providers: [HeroSearchService]
})
export class HeroSearchComponent implements OnInit {
  heroes: Observable<Hero[]>;
  // a Subject is a producer of an observable event stream
  private searchTerms = new Subject<string>();

  constructor(
    private HeroSearchService: HeroSearchService,
    private router: Router) { }

  // each call to search puts a new string into
  // this subject's observable stream 
  search(term: string): void {
    this.searchTerms.next(term);
  }

  // A Subject is also an Observable. We're going to turn
  // the stream of search terms into a stream of Hero arrays
  // and assign the result to the heroes property
  ngOnInit(): void {
    this.heroes = this.searchTerms
      .debounceTime(300) // wait for 300ms pause in events
      .distinctUntilChanged() // ignore if next search term is same as prev
      .switchMap(term => term // switch to new observable each time
        // return the http search observable
        ? this.HeroSearchService.search(term)
        // or the observable of empty heroes if no search term
        : Observable.of<Hero[]>([]))
      .catch(error => {
        console.log(error);
        return Observable.of<Hero[]>([]);
      });
  }

  gotoDetail(hero: Hero): void {
    let link = ['detail', hero.id];
    this.router.navigate(link);
  }
}
