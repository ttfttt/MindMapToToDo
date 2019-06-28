import { connect } from 'react-redux'
import { Dispatch, Action } from 'redux'
import { ReduxState } from '../store'
import { TodoInfo } from '../modules/Todo';
import { todoListActions, TodoList } from 'modules/TodoList';
import axios from 'axios';
import { deleteTodo } from './TodoContainer';

export interface TodoListActions {
    get: () => Action<string>;
    remove: (todo: TodoInfo) => Action<string>;
}

export function getList(): Promise<TodoInfo[]> {
    return axios.request<TodoInfo[]>({
        method: "get",
        url: "http://localhost:8000/api/todolist"
    })
        .then(res => res.data.sort((t1, t2) => (t1.priority || 0) - (t2.priority || 0)));
};

function mapDispatchToProps(dispatch: Dispatch<Action<string>>) {
    return {
        get: () => {
            getList().then(res => {
                dispatch(todoListActions.get.done({ params: { isLoading: false }, result: res }))
            }).catch(_err => {
                console.log(_err)
                dispatch(todoListActions.get.failed({ params: { isLoading: false }, error: "サーバーにつなげなかった..." }));
            });
            return dispatch(todoListActions.get.started({ isLoading: true }))
        },
        remove: (todo: TodoInfo) => {
            deleteTodo(todo).then(() => {
                getList().then(res => {
                    dispatch(todoListActions.get.done({ params: { isLoading: false }, result: res }))
                }).catch(_err => {
                    console.log(_err)
                    dispatch(todoListActions.get.failed({ params: { isLoading: false }, error: "サーバーにつなげなかった..." }));
                });
            }).catch(_err => {
                console.log(_err)
                dispatch(todoListActions.remove.failed({ params: { isLoading: false }, error: "サーバーにつなげなかった..." }));
            });
            return dispatch(todoListActions.remove.started({ isLoading: true }))
        }
    };
}

function mapStateToProps(state: ReduxState) {
    return Object.assign({}, { todoListState: state.todoListState });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TodoList)