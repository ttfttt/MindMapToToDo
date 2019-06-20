import { connect } from 'react-redux'
import { Dispatch, Action } from 'redux'
import { ReduxState } from '../store'
import { Todo, todoActions, TodoInfo } from '../modules/Todo';
import { todoListActions } from 'modules/TodoList';

export interface TodoActions {
    inputTitle: (name: string) => Action<string>;
    inputDetail: (name: string) => Action<string>;
    submit: (todo: TodoInfo) => Action<string>;
}

function mapDispatchToProps(dispatch: Dispatch<Action<string>>) {
    return {
        inputTitle: (name: string) => {
            return dispatch(todoActions.inputTitle(name))
        },
        inputDetail: (name: string) => {
            return dispatch(todoActions.inputDetail(name))
        },
        submit: (todo: TodoInfo) => {
            return dispatch(todoListActions.add(todo))
        }
    };
}

function mapStateToProps(state: ReduxState) {
    return Object.assign({}, { todoState: state.todoState });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Todo)