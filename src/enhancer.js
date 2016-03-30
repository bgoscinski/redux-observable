import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/publishBehavior'
import 'rxjs/add/operator/let'
import 'rxjs/add/operator/map'

const prepareObservable = (obs) => obs
  .distinctUntilChanged()
  .publishBehavior()
  .refCount()

export function observableEnhancer() {
  return (createStore) => (reducer, initState, enhancer) => {
    const store = createStore(reducer, initState, enhancer)
    const state$ = Observable.create((observer) => {
        observer.next(store.getState())

        return store.subscribe(() => {
          observer.next(store.getState())
        })
      })
      .let(prepareObservable)

    const getState$ = () => state$

    const select = (selector) => getState$()
      .map(selector)
      .let(prepareObservable)

    return { ...store, getState$, select }
  }
}

