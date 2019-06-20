import React from "react";
import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { ReduxState } from '../store';
import { Button } from 'react-bootstrap';
import { HomeActions } from "../containers/HomeContainer";

// action
const actionCreator = actionCreatorFactory();

export const homeActions = {
    inputText: actionCreator<string>('home/inputText'),
    submit: actionCreator<void>('home/submit')
};

// reducer
export interface HomeInfo {
    name: string,
    isConfirm?:boolean
}

const initialState: HomeInfo = {name: ""};

export const homeReducer = reducerWithInitialState<HomeInfo>(initialState)
    .case(homeActions.inputText, (state, amount) => {
        state.name = amount;
        return Object.assign({},state);
    })
    .case(homeActions.submit, (state) => {
        state.isConfirm = true;
        return Object.assign({},state);
    })

export type Props = ReduxState & HomeActions;

export class Home extends React.Component<Props> {

    public render() {
        return (
            <div>
                <input value={this.props.homeState.name} onChange={e=>this.props.inputText(e.target.value)} />
                <Button onClick={() => this.props.submit()}>submit</Button>
                <div>{this.props.homeState.isConfirm ? this.props.homeState.name:""}</div>
            </div>
        );
    }
}