import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NotFound from "./containers/NotFound";
import Signup from './containers/Signup';

export default ({...childProps}) =>
    <Switch>
        <Route path="/" exact render={props => <Home {...childProps} {...props}/>} />
        <Route path="/login" exact render={props => <Login {...childProps} {...props}/>} />
        <Route path="/signup" exact render={props => <Signup {...childProps} {...props}/>} />
        { /* Finally, catch all unmatched routes */}
        <Route component={NotFound} />
    </Switch>;

