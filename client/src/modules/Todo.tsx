import React from "react";
import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { ReduxState } from '../store';
import { Button } from 'react-bootstrap';
import { TodoActions } from "../containers/TodoContainer";

// action
const actionCreator = actionCreatorFactory();

export const todoActions = {
    inputTitle: actionCreator<string>('todo/inputTitle'),
    inputDetail: actionCreator<string>('todo/inputText'),
    submit: actionCreator<void>('todo/submit')
};

// reducer
export interface TodoInfo {
    id: number,
    title: string,
    detail?: string,
    isConfirm?: boolean
}

const initialState: TodoInfo = { id: 0, title: "" };

export const todoReducer = reducerWithInitialState<TodoInfo>(initialState)
    .case(todoActions.inputTitle, (state, amount) => {
        state.title = amount;
        return Object.assign({}, state);
    })
    .case(todoActions.inputDetail, (state, amount) => {
        state.detail = amount;
        return Object.assign({}, state);
    })
    .case(todoActions.submit, () => {
        return initialState;
    })

export type Props = ReduxState & TodoActions;

export class Todo extends React.Component<Partial<Props>> {
    public render() {
        return (
            <div>
                <input value={this.props.todoState!.title} onChange={e => this.props.inputTitle!(e.target.value)} />
                <input value={this.props.todoState!.detail} onChange={e => this.props.inputDetail!(e.target.value)} />
                <Button onClick={() => this.props.submit!(this.props.todoState!)}>submit</Button>
            </div>
        );
    }
}