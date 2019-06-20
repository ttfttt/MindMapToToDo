import { connect } from 'react-redux'
import { ReduxState } from '../store'
import { Home } from '../modules/Home';
import { Dispatch } from 'react';
import { Action } from 'redux';
import { todoActions, TodoInfo } from 'modules/Todo';
import { todoListActions } from 'modules/TodoList';

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
    return Object.assign({}, { todoState: state.todoState, todoListState: state.todoListState });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)