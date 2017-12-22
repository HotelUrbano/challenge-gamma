import 'normalize.css';
import 'babel-polyfill';
import 'jquery';
import 'font-awesome/css/font-awesome.min.css';
import 'toastr/build/toastr.min.css';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import AppContainer from './containers/App';
import configureStore from './store';
import { loadBackground } from './actions/backgroundActions';

const store = configureStore();
store.dispatch(loadBackground());

render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('app')
);
