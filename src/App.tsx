import { Auth, Hub } from "aws-amplify";
import React, { Component, Fragment } from "react";
import { Nav, Navbar, Spinner } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { withRouter, RouteComponentProps } from "react-router-dom";
import "./App.scss";
import Routes from "./Routes";

export interface State {
    authState: string;
    authData?: any;
    authError?: any;
}

export interface ChildProperties {
    appState: State;
    isLoading: boolean;
    isSignedIn: boolean;
    isSignIn: boolean;
    setAuthState: (v: string) => any;
}

class App extends Component<RouteComponentProps<any>, State> {

    constructor(props: RouteComponentProps<any>) {
        super(props);

        this.signOut = this.signOut.bind(this);
        // let the Hub module listen on Auth events
        Hub.listen('auth', (data) => {
            switch (data.payload.event) {
                case 'signIn':
                    this.setState({ authState: 'signedIn' });
                    this.setState({ authData: data.payload.data });
                    this.props.history.push("/");
                    break;
                case 'signIn_failure':
                    this.setState({ authState: 'signIn' });
                    this.setState({ authData: null });
                    this.setState({ authError: data.payload.data });
                    break;
                default:
                    break;
            }
        });
        this.state = {
            authState: 'loading',
            authData: null,
            authError: null
        }
    }

    async componentDidMount() {
        try {
            await Auth.currentSession();
            this.setState({ authState: 'signedIn' });
        } catch (e) {
            this.setState({ authState: 'signIn' });
        }
    }

    async signOut() {
        await Auth.signOut();
        this.setState({ authState: 'signIn' });
        this.props.history.push("/login");
    }

    checkAuthState = (authStateToCheck: string) => {
        return this.state.authState === authStateToCheck;
    }

    setAuthState = (stateValue: string) => {
        this.setState({ authState: stateValue });
    }

    render() {

        const childProps: ChildProperties = {
            appState: this.state,
            isLoading: this.checkAuthState('loading'),
            isSignedIn: this.checkAuthState('signedIn'),
            isSignIn: this.checkAuthState('signIn'),
            setAuthState: this.setAuthState
        };

        return (
            <div>
                {
                    childProps.isLoading ?
                    <div className="App container">
                        <Spinner animation="grow" variant="primary" />
                    </div>
                    :
                    <div className="App container">
                        <Navbar bg="light" >
                            <LinkContainer to="/">
                                <Navbar.Brand href="#">Home</Navbar.Brand>
                            </LinkContainer>
                            <Navbar.Toggle />
                            <Navbar.Collapse className="justify-content-end">
                                {childProps.isSignedIn
                                    ? <Nav.Link onClick={this.signOut}>Logout</Nav.Link>
                                    : <Fragment>
                                        <LinkContainer to="/login">
                                            <Nav.Link href="#">Sign in</Nav.Link>
                                        </LinkContainer>
                                    </Fragment>
                                }
                            </Navbar.Collapse>
                        </Navbar>
                        <Routes childProps={childProps} />
                    </div>
                }
            </div>
        );
    }

}

export default withRouter(App);
