import {Observable} from 'rxjs/Observable'

export function observableMiddleware({ dispatch }) {
  return (next) => (action) => {
    if (action instanceof Observable) {
      return action.subscribe(dispatch)
    }

    return next(action)
  }
}


