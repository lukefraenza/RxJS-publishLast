import { interval, timer, ConnectableObservable, Observable } from 'rxjs';
import { publishLast, publishBehavior, tap, take, map } from 'rxjs/operators';

console.clear();

/**
 * MOCK STUFF
 */

type FilterDataResponse = { foo: number };

type fakeContext = {
  stuff?: string,
  filterData: Observable<FilterDataResponse[]>
};

// simulation of an API call that takes a second to respond
const fakeApiCall$ = timer(1000).pipe(
  take(1),
  tap(x => console.log('API is being called...')),
  map(x => {
    return <FilterDataResponse[]>[{ foo: x }];
  })
);

class MockPanel {
  constructor(public panelName: string){}

  public open(context: fakeContext) {
    context.filterData.subscribe(
        x => console.log(`Panel ${this.panelName}:`, x),
        err => console.log(`Panel ${this.panelName} Error:`, err),
        () => console.log(`Panel ${this.panelName} Complete`));
  }
}

/**
 * Code example
 */


// this would be a private property in your class
const filterData$: Observable<FilterDataResponse[]> = fakeApiCall$.pipe(
  publishLast()
  );

(filterData$ as ConnectableObservable<any>).connect();

// this is whatever function you have that opens the panel
function openPanel(panel: MockPanel) {
  let context = {
    stuff: "things",
    filterData: filterData$
  };
  console.log(`opening panel ${panel.panelName}...`);
  panel.open(context);
}

console.log(`shouldn't call API yet`);
const panelA = new MockPanel('A');
const panelB = new MockPanel('B');


openPanel(panelA);


setTimeout(() => {
  openPanel(panelB);
}, 5000);
