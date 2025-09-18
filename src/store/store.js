import { createStore,combineReducers, applyMiddleware, compose } from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {thunk} from 'redux-thunk'

import Loader from "./reducers/loader";

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const composeEnhancers = compose;

const rootReducer = combineReducers(
    {
        loader: Loader
    }
)

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

export default store