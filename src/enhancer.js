import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/map'

export function observableEnhancer() {
  return (createStore) => (reducer, initState, enhancer) => {
    const store = createStore(reducer, initState, enhancer)
      
    const getState$ = () => Observable.create((observer) => {
      return store.subscribe(observer.next.bind(observer))
    })

    const select = (maybeMapper) => maybeMapper
      ? getState$().map(maybeMapper)
      : getState$()

    return {
      ...store
      getState$,
      select 
    }   
  }
}

