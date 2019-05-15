import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";
import { Auth } from "aws-amplify";
import React, { Component } from "react";
import { Card, Form, FormControl, FormControlProps, FormGroup } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { Link } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import "./Login.scss";

export interface State {
    isLoading: boolean;
    email: string;
    password: string;
}

export default class Login extends Component<{}, State> {
    constructor(props: {}) {
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

    handleChange = (event: React.FormEvent<FormControlProps>) => {
        if (event.currentTarget.id) {
            this.setState<never>({ [event.currentTarget.id]: event.currentTarget.value });
        }
    }

    /**
     * Handles form submission
     * @param {React.FormEvent<HTMLFormElement>} e - The form event
     */
    handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
            await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
        } catch (e) {
            console.log(e.message);
        }
    }

    render() {
        return (
            <div>
                <Card className="Login" style={{ width: '25rem' }}>
                    <Card.Header as="h5">Sign in to your account</Card.Header>
                    <Card.Body>
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup controlId="email">
                                <Form.Label>Email</Form.Label>
                                <FormControl
                                    autoFocus
                                    placeholder="e-mail adress"
                                    type="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="password">
                                <Form.Label>Password</Form.Label>
                                <FormControl
                                    placeholder="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    type="password"
                                />
                                <Form.Text className="text-muted">
                                    Forgot your password? <Link to="/forgotPassword">Reset password</Link>
                                </Form.Text>
                            </FormGroup>
                            <Form.Text className="text-body" style={{ fontSize: '100%' }}>
                                No account? <Link to="/signup">Sign up</Link>
                            </Form.Text>
                            <LoaderButton
                                disabled={!this.validateForm()}
                                isLoading={this.state.isLoading}
                                text="Login"
                                loadingText="Logging in…"
                            />
                        </form>
                    </Card.Body>
                    <div className="text-uppercase text-muted text-inBorder"><p>or</p></div>
                    <Card.Body>
                        <GoogleButton style={{ marginLeft: 'auto', marginRight: 'auto' }} onClick={() => this.googleLogin()} />
                    </Card.Body>
                </Card>
            </div>
        ); 
    }
}
