import { combineReducers, createStore, applyMiddleware } from 'redux'
import { TodoInfo, todoReducer } from './modules/Todo';
import thunk from 'redux-thunk';
import { TodoListInfo, todoListReducer } from './modules/TodoList';
import { HomeInfo, homeReducer } from 'modules/Home';

export type ReduxState = {
    homeState: HomeInfo,
    todoState: TodoInfo,
    todoListState: TodoListInfo
}

const store = createStore(
    combineReducers<ReduxState>({
        homeState: homeReducer,
        todoState: todoReducer,
        todoListState: todoListReducer
    }),
    applyMiddleware(thunk)
);

export default store;