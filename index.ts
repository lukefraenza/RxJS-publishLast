import { interval, ConnectableObservable } from 'rxjs';
import { publishLast, publishBehavior, tap, take, refCount } from 'rxjs/operators';
 
console.clear();

const connectable =
  interval(1000)
    .pipe(
      tap(x => console.log("side effect", x)),
      take(3),
      publishLast());
 
connectable.subscribe(
  x => console.log(  "Sub. A", x),
  err => console.log("Sub. A Error", err),
  () => console.log( "Sub. A Complete"));
 
 setTimeout(() => {
connectable.subscribe(
  x => console.log(  "Sub. B", x),
  err => console.log("Sub. B Error", err),
  () => console.log( "Sub. B Complete"));
 },5000);

 

(connectable as ConnectableObservable<any>).connect();