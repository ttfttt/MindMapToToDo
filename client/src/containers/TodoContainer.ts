import { connect } from 'react-redux'
import { Dispatch, Action } from 'redux'
import { ReduxState } from '../store'
import { Todo, todoActions, TodoInfo } from '../modules/Todo';
import axios from 'axios'
import { RouteComponentProps } from 'react-router';

export function getTodo(id: string): Promise<TodoInfo> {
    return axios.request<TodoInfo>({
        method: "get",
        url: `http://localhost:8000/api/todo/${id}`
    }).then(res => res.data);
};

export function addTodo(todo: TodoInfo): Promise<TodoInfo> {
    return axios.request<TodoInfo>({
        method: "post",
        url: "http://localhost:8000/api/todo",
        data: todo
    })
        .then(res => res.data)
};

export function updateTodo(todo: TodoInfo): Promise<TodoInfo> {
    return axios.request<TodoInfo>({
        method: "put",
        url: `http://localhost:8000/api/todo/${todo.id}`,
        data: todo
    }).then(res => res.data);
};

export function deleteTodo(todo: TodoInfo): Promise<TodoInfo> {
    return axios.request<TodoInfo>({
        method: "delete",
        url: `http://localhost:8000/api/todo/${todo.id}`,
        data: todo
    }).then(res => res.data);
};


export interface TodoActions {
    setAll: (todo: TodoInfo) => Action<string>;
    inputTitle: (name: string) => Action<string>;
    inputDetail: (name: string) => Action<string>;
    inputPriority: (priority: number) => Action<string>;
    submit: (todo: TodoInfo) => Action<string>;
    cancel: () => Action<string>;
    delete: (todo: TodoInfo) => Action<string>;
}

function mapDispatchToProps(dispatch: Dispatch<Action<string>>) {
    return {
        setAll: (todo: TodoInfo) => {
            return dispatch(todoActions.setAll(todo))
        },
        inputTitle: (title: string) => {
            return dispatch(todoActions.inputTitle(title))
        },
        inputDetail: (detail: string) => {
            return dispatch(todoActions.inputDetail(detail))
        },
        inputPriority: (priority: number) => {
            return dispatch(todoActions.inputPriority(priority))
        },
        submit: (todo: TodoInfo) => {
            (todo.id ? updateTodo(todo) : addTodo(todo)).then(() => {
                dispatch(todoActions.submit.done({ params: {}, result: "" }))
            }).catch(_err => {
                console.log(_err)
                dispatch(todoActions.submit.failed({ params: {}, error: "サーバーにつなげなかった..." }));
            });
            return dispatch(todoActions.submit.started({}))
        },
        cancel: () => {
            return dispatch(todoActions.cancel());
        },
        delete: (todo: TodoInfo) => {
            deleteTodo(todo).then(() => {
                dispatch(todoActions.delete.done({ params: {}, result: {} }))
            }).catch(_err => {
                console.log(_err)
                dispatch(todoActions.submit.failed({ params: {}, error: "サーバーにつなげなかった..." }));
            });
            return dispatch(todoActions.submit.started({}))
        }
    };
}

function mapStateToProps(state: ReduxState, props: RouteComponentProps<{ id: string }>) {
    return Object.assign({}, { todoState: state.todoState, props: props });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Todo)