import { connect } from 'react-redux'
import { ReduxState } from '../store'
import { Home, homeActions } from '../modules/Home';
import { Dispatch, Action } from 'redux';
import axios from 'axios';
import { withRouter } from 'react-router';

export interface HomeActions {
    pong: () => Action<string>;
}

function mapStateToProps(state: ReduxState) {
    return Object.assign({}, { homeState: state.homeState, todoState: state.todoState, todoListState: state.todoListState });
}

export function mapDispatchToProps(dispatch: Dispatch<Action<string>>) {
    return {
        pong: () => {
            axios.request<{ [key: string]: string; }>({
                method: "get",
                url: "http://localhost:8000/api/ping"
            }).then(res => {
                dispatch(homeActions.getPong.done({ params: "true", result: res.data["message"] }))
            }).catch(_err => {
                console.log(_err)
                dispatch(homeActions.getPong.failed({ params: "", error: "サーバーにつなげなかった..." }));
            });
            return dispatch(homeActions.getPong.started(""));
        }
    }
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Home))