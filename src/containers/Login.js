import { Auth } from "aws-amplify";
import React, { Component } from "react";
import { Form, FormControl, FormGroup } from "react-bootstrap";
import GoogleButton from "react-google-button";
import LoaderButton from "../components/LoaderButton";
import "./Login.scss";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            email: "",
            password: ""
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            await Auth.signIn(this.state.email, this.state.password);
        } catch (e) {
            console.log(e.message);
        }
    }

    async googleLogin() {
        try {
            await Auth.federatedSignIn({ provider: 'Google' });
        } catch (e) {
            console.log(e.message);
        }
    }

    render() {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="email">
                        <Form.Label>Email</Form.Label>
                        <FormControl
                            autoFocus
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password">
                        <Form.Label>Password</Form.Label>
                        <FormControl
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <LoaderButton
                        block
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Login"
                        loadingText="Logging in…"
                    />
                </form>
                <div style={{marginTop: '5px', marginBottom: '5px'}}>or</div>
                <GoogleButton style={{marginLeft: 'auto', marginRight: 'auto'}} onClick={() => this.googleLogin()} />
            </div>
        );
    }
}
