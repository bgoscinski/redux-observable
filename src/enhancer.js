import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/publishBehavior'

export function observableEnhancer() {
  return (createStore) => (reducer, initState, enhancer) => {
    const store = createStore(reducer, initState, enhancer)
    const state$ = Observable.create((observer) => {
        return store.subscribe(() => {
          observer.next(store.getState())
        })
      })
      .distinctUntilChanged()
      .publishBehavior(store.getState())
      .refCount()

    const getState$ = () => state$

    const select = (selector) => getState$()
      .map(selector)
      .distinctUntilChanged()
      .publishBehavior()
      .refCount()

    return { ...store, getState$, select }
  }
}

