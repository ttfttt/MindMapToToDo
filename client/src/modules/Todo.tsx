import React from "react";
import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { ReduxState } from '../store';
import { Button, Row, Col, Container } from 'react-bootstrap';
import { TodoActions, getTodo } from "../containers/TodoContainer";
import { RouteComponentProps } from "react-router";

// action
const actionCreator = actionCreatorFactory();

export const todoActions = {
    setAll: actionCreator<TodoInfo>('todo/setAll'),
    inputTitle: actionCreator<string>('todo/inputTitle'),
    inputDetail: actionCreator<string>('todo/inputText'),
    inputPriority: actionCreator<number>('todo/inputPriority'),
    submit: actionCreator.async<{}, string, string>('todo/submit'),
    cancel: actionCreator('todo/cancel'),
    delete: actionCreator.async('todo/delete'),
    clearUpdateMessage: actionCreator('todo/clearUpdateMessage')
};

// reducer
export interface TodoInfo {
    id: number,
    title: string,
    detail?: string,
    priority?: number,
    isUpdatedMessage?: string
}

const initialState: TodoInfo = { id: 0, title: "" };

export const todoReducer = reducerWithInitialState<TodoInfo>(initialState)
    .case(todoActions.setAll, (_state, amount) => amount)
    .case(todoActions.inputTitle, (state, amount) => {
        return Object.assign({}, state, { title: amount });
    })
    .case(todoActions.inputDetail, (state, amount) => {
        return Object.assign({}, state, { detail: amount });
    })
    .case(todoActions.inputPriority, (state, amount) => {
        return Object.assign({}, state, { priority: amount });
    })
    .case(todoActions.submit.done, (state) => {
        return Object.assign({}, state, { isUpdatedMessage: "更新されました" })
    })
    .case(todoActions.submit.failed, (state) => {
        return state;
    })
    .case(todoActions.cancel, () => initialState)
    .case(todoActions.delete.started, () => {
        return Object.assign({}, initialState, { isUpdatedMessage: "削除中です" })
    })
    .case(todoActions.delete.done, () => {
        return Object.assign({}, initialState, { isUpdatedMessage: "削除されました" })
    })
    .case(todoActions.clearUpdateMessage, (state) => {
        return Object.assign({}, state, { isUpdatedMessage: "" })
    })

export type Props = ReduxState & TodoActions & RouteComponentProps<{ id: string }>;

enum viewState {
    LOADING, NOTFOUND, CREATE, UPDATE, READONLY
}

export class Todo extends React.Component<Props, { view: viewState }> {

    componentWillMount() {
        this.setState({ view: viewState.LOADING });
        if (this.props.match.params.id) {
            getTodo(this.props.match.params.id).then(res => {
                this.props.setAll(res);
                this.setState({ view: viewState.READONLY });
            })
                .catch(() => {
                    this.setState({ view: viewState.NOTFOUND });
                });
        } else {
            this.props.setAll(initialState);
            this.setState({ view: viewState.CREATE });
        }
    }

    private editView = () => this.setState({ view: viewState.UPDATE });

    private inputTitle = (e: React.ChangeEvent<HTMLInputElement>) => this.props.inputTitle(e.target.value);
    private inputPriority = (e: React.ChangeEvent<HTMLInputElement>) => this.props.inputPriority(Number(e.target.value));
    private inputDetail = (e: React.ChangeEvent<HTMLTextAreaElement>) => this.props.inputDetail(e.target.value);
    private submit = () => this.props.submit(this.props.todoState);
    private cancel = () => this.props.cancel();
    private delete = () => this.props.delete(this.props.todoState);
    public render() {
        return (
            this.state.view ?
                this.state.view !== viewState.NOTFOUND ? <div>
                    {
                        this.state.view === viewState.READONLY || this.props.todoState.isUpdatedMessage ?
                            <Container fluid>
                                <Row>
                                    <Col {...{ className: "border border-dark" }} sm={2}>タイトル</Col>
                                    <Col {...{ className: "border border-dark" }}>{this.props.todoState.title || ""}</Col>
                                </Row>
                                <Row>
                                    <Col {...{ className: "border border-dark" }} sm={2}>優先度</Col>
                                    <Col {...{ className: "border border-dark" }}>{this.props.todoState.priority}</Col>
                                </Row>
                                <Row>
                                    <Col {...{ className: "border border-dark" }} sm={2}>詳細</Col>
                                    <Col {...{ className: "border border-dark" }} style={{ whiteSpace: 'pre-line' }}>{this.props.todoState.detail || ""}</Col>
                                </Row>
                                <Row>
                                    <Col sm={{ span: 5, offset: 7 }}>
                                        <Button variant="primary" onClick={this.editView}>編集</Button>
                                    </Col>
                                </Row>
                            </Container> :
                            <Container fluid>
                                <Row>
                                    <Col sm={2}>タイトル</Col>
                                    <Col>
                                        <input type="text" style={{ width: "100%" }} value={this.props.todoState.title || ""} onChange={this.inputTitle} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={2}>優先度</Col>
                                    <Col>
                                        <input type="number" style={{ width: "100%" }} placeholder="number only" value={this.props.todoState.priority || ""} onChange={this.inputPriority} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={2}>詳細</Col>
                                    <Col>
                                        <textarea style={{ width: "100%" }} value={this.props.todoState.detail || ""} onChange={this.inputDetail}></textarea>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={{ span: 5, offset: 7 }}>
                                        <Button onClick={this.submit}>submit</Button>
                                        <Button variant="warning" onClick={this.cancel}>cancel</Button>
                                        {
                                            this.state.view === 3 && <Button variant="danger" onClick={this.delete}>delete</Button>
                                        }
                                    </Col>
                                </Row>
                            </Container>
                    }
                    <h2>{this.props.todoState.isUpdatedMessage}</h2>
                </div> :
                    <div>Not found</div>
                :
                <div>loading...</div>
        );
    }
}