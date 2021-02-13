import React from 'react';
import {useAuth0} from "@auth0/auth0-react";
import historyRouting from "./history";
import { Router, Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import WaveButton from "../WaveButton/WaveButton";
import UserPage from "../UserPage/UserPage";
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

const App = () => {
    const { isAuthenticated, isLoading, user } = useAuth0();

    let history = useHistory();

    if (isLoading) {
        return (
            <Grid container alignItems="center" justify="center"
                  style={{position: "absolute", width: '100%', height: '100%'}}>
                <CircularProgress/>
            </Grid>
        );
    }

    function login() {
        if (!isAuthenticated) {
            return (
                <Route exact path="/">
                    <Redirect to="/login"/>
                </Route>
            );
        }
    }

    function toUserPage() {
        if (isAuthenticated) {
            return (
                <Route exact path="/">
                    <Redirect to={`/user/${user.email}`} />
                </Route>
            );
        }
    }

    return (
        <div>
                <Switch>
                    {/*{isAuthenticated ? <Redirect exact from="/" to={`/user/:${user.email}`} /> : <Redirect  exact from="/" to="/login" />}*/}

                    {/*<Route path="/login" component={WaveButton}/>*/}
                    {/*<Route path={`/user/:${user.email}`} component={UserPage}/>*/}

                    {login()}
                    {toUserPage()}

                    <Route exact path="/login" component={WaveButton}/>
                    <Route path="/user/:user" component={withRouter(UserPage)} />


                </Switch>
        </div>
    );
};

export default App;

