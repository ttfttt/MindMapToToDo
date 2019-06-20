import { combineReducers, createStore, applyMiddleware } from 'redux'
import { TodoInfo, todoReducer } from './modules/Todo';
import thunk from 'redux-thunk';
import { TodoListInfo, todoListReducer } from './modules/TodoList';

export type ReduxState = {
    todoState: TodoInfo,
    todoListState: TodoListInfo
}

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const store = createStoreWithMiddleware(
    combineReducers<ReduxState>({
        todoState: todoReducer,
        todoListState: todoListReducer
    })
)

export default store;