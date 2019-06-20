import React from "react";
import { Todo } from "./Todo";
import { TodoList } from "./TodoList";
import { ReduxState } from "store";

type Props = ReduxState;

export class Home extends React.Component<Props> {

    public render() {
        return (
            <div>
                <Todo {...this.props} />
                <TodoList {...this.props} />
            </div>
        );
    }
}