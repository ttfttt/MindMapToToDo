import React from "react";
import { ReduxState } from "store";
import { RouteComponentProps } from 'react-router';
import TodoListContainer from "containers/TodoListContainer";
import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { HomeActions } from "../containers/HomeContainer";
import { Button } from "react-bootstrap";

// action
const actionCreator = actionCreatorFactory();

export const homeActions = {
    getPong: actionCreator.async<string, string, string>('home/getPong')
};

// reducer
export type HomeInfo = {
    message: string
}

const initialState: HomeInfo = { message: "" };

export const homeReducer = reducerWithInitialState<HomeInfo>(initialState)
    .case(homeActions.getPong.started, (state, amount) => {
        return state;
    })
    .case(homeActions.getPong.done, (state, amount) => {
        return Object.assign({}, state, { message: amount.result });
    })
    .case(homeActions.getPong.failed, (state, amount) => {
        return Object.assign({}, state, { message: amount.error });
    })

type Props = ReduxState & HomeActions & RouteComponentProps;

export class Home extends React.Component<Props> {

    public render() {
        return (
            <div>
                <label>{this.props.homeState.message}</label>
                <Button onClick={() => this.props.history.push('/detail')}>追加</Button>
                <div>
                    <TodoListContainer {...this.props} />
                </div>
            </div>
        );
    }
}