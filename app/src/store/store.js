import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {
    reducer as dataReducer,
    DATA as dataModule
} from './actions'

const rootReducer = combineReducers({
    [dataModule]: dataReducer
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;