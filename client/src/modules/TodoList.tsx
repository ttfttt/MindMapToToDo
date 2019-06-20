import React from "react";
import { TodoInfo } from "./Todo";
import { ReduxState } from "store";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import actionCreatorFactory from "typescript-fsa";
import { TodoListActions } from "containers/TodoListContainer";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

// action
const actionCreator = actionCreatorFactory();

export const todoListActions = {
    get: actionCreator.async<TodoListViewParam, TodoInfo[], string>('todoList/get'),
    remove: actionCreator.async<TodoListViewParam, TodoInfo[], string>('todoList/remove')
};

// reducer
// status params
export type TodoListInfo = {
    globalId?: number
    todoList: TodoInfo[]
    isloading: boolean
}

// View params
export type TodoListViewParam = { isLoading: boolean }

const initialState: TodoListInfo = { globalId: 0, todoList: [], isloading: true };

export const todoListReducer = reducerWithInitialState<TodoListInfo>(initialState)
    .case(todoListActions.get.started, (state, params) => {
        return Object.assign({}, state, params);
    })
    .case(todoListActions.get.done, (state, amount) => {
        return Object.assign({}, state, { todoList: amount.result, isloading: amount.params.isLoading });
    })
    .case(todoListActions.remove.done, (state, amount) => {
        let info: TodoListInfo = { todoList: state.todoList, isloading: amount.params.isLoading };
        return Object.assign({}, state, info);
    })

export type Props = ReduxState & TodoListActions;

export class TodoList extends React.Component<Props>{

    componentWillMount() {
        this.props.get();
    }

    private delete(todo: TodoInfo) {
        this.props.remove(todo);
        this.props.get();
        return;
    };

    public render() {
        const todoList = this.props.todoListState.todoList.map((todo, idx) => {
            return (
                <tr key={idx} id={idx + ""}>
                    <td><Link to={`/detail/${todo.id}`}>{todo.title}</Link></td>
                    <td>{todo.priority}</td>
                    <td><Button variant="danger" onClick={() => this.delete(todo)}>削除</Button></td>
                </tr>
            )
        })
        return (
            this.props.todoListState.isloading ? <div>isloading...</div> :
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>タイトル</th>
                            <th>優先度</th>
                            <th>アクション</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todoList}
                    </tbody>
                </Table>
        );
    }
}