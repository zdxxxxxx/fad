import React from 'react';
import { Router, Route, IndexRoute, Link, IndexRedirect } from 'dva/router';
import Index from './pages/index.jsx';
export default function ({ history, app }) {
    return (
        <Router history={history}>
            <Route path="/" component={Index}>

            </Route>
        </Router>
    );
};
