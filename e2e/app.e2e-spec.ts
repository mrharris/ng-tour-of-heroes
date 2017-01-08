import { NgTourOfHeroesPage } from './app.po';

describe('ng-tour-of-heroes App', function() {
  let page: NgTourOfHeroesPage;

  beforeEach(() => {
    page = new NgTourOfHeroesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
