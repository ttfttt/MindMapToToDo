import { connect } from 'react-redux'
import { Dispatch,Action } from 'redux'
import { ReduxState } from '../store'
import { Home, homeActions } from '../modules/Home';

export interface HomeActions {
    inputText: (name: string) => Action<string>;
    submit: () => Action<string>;
}

function mapDispatchToProps(dispatch: Dispatch<Action<string>>) {
    return {
        inputText: (name: string) => {
            return dispatch(homeActions.inputText(name))
        },
        submit: () => {
            return dispatch(homeActions.submit())
        }
    };
}

function mapStateToProps(state: ReduxState) {
    return Object.assign({}, { homeState: state.homeState });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)