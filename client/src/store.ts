import { combineReducers, createStore, applyMiddleware } from 'redux'
import { HomeInfo, homeReducer } from './modules/Home';
import thunk        from 'redux-thunk';

export type ReduxState = {
    homeState: HomeInfo
}

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const store = createStoreWithMiddleware(
    combineReducers<ReduxState>({
        homeState: homeReducer
    })
)

export default store;