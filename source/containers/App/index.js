import React from 'react';

import App from '../../components/App';
import { connect } from 'react-redux';

class AppContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            backgroundUrl: '',
        };
    }

    render() {
        return (
            <App backgroundImage={this.props.backgroundUrl}/>
        );
    }
}

const mapStateToProps = (state, ownProps) =>
({ backgroundUrl: state.backgroundUrl });

export default connect(mapStateToProps, null)(AppContainer);
