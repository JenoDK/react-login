import { Auth } from "aws-amplify";
import React, { Component, Fragment } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { withRouter } from "react-router-dom";
import "./App.css";
import Routes from "./Routes";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            isAuthenticating: true
        };
    }

    async componentDidMount() {
        try {
            await Auth.currentSession();
            this.userHasAuthenticated(true);
        }
        catch (e) {
            if (e !== 'No current user') {
                alert(e);
            }
        }

        this.setState({ isAuthenticating: false });
    }


    userHasAuthenticated = authenticated => {
        this.setState({ isAuthenticated: authenticated });
    }

    handleLogout = async event => {
        await Auth.signOut();
        this.userHasAuthenticated(false);
        this.props.history.push("/login");
    }

    render() {

        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated
        };

        return (
            !this.state.isAuthenticating &&
            <div className="App container">
                <Navbar bg="light" >
                    <LinkContainer to="/">
                        <Navbar.Brand href="#">Home</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        {this.state.isAuthenticated
                            ? <Nav.Link onClick={this.handleLogout}>Logout</Nav.Link>
                            : <Fragment>
                                <LinkContainer to="/signup">
                                    <Nav.Link href="#">Signup</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/login">
                                    <Nav.Link href="#">Login</Nav.Link>
                                </LinkContainer>
                            </Fragment>
                        }
                    </Navbar.Collapse>
                </Navbar>
                <Routes childProps={childProps} />
            </div>
        );
    }

}

export default withRouter(App);
