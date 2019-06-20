import React from "react";
import { TodoInfo } from "./Todo";
import { ReduxState } from "store";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import actionCreatorFactory from "typescript-fsa";

// action
const actionCreator = actionCreatorFactory();

export const todoListActions = {
    add: actionCreator<TodoInfo>('todoList/add'),
    remove: actionCreator<TodoInfo>('todoList/remove')
};

// reducer
export type TodoListInfo = {
    userName: string,
    todoList: TodoInfo[]
}

const initialState: TodoListInfo = { userName: "test", todoList: [] };

export const todoListReducer = reducerWithInitialState<TodoListInfo>(initialState)
    .case(todoListActions.add, (state, todo) => {
        state.todoList.push(todo);
        return Object.assign({}, state);
    })
    .case(todoListActions.remove, (state, todo) => {
        state.todoList = state.todoList.filter(t => t.id !== todo.id);
        return Object.assign({}, state);
    })

export type Props = ReduxState;

export class TodoList extends React.Component<Props>{
    public render() {
        const todoList =
            this.props.todoListState.todoList.map((todo, idx) => {
                return (
                    <tr key={idx} id={idx + ""}>
                        <td>{todo.title}</td>
                        <td>{todo.detail}</td>
                    </tr>
                )
            });
        return (
            <div>
                {todoList}
            </div>
        );
    }
}