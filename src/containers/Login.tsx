import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";
import { Auth } from "aws-amplify";
import React, { Component } from "react";
import { Card, Form, FormControl, FormControlProps, FormGroup, Alert } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { Link } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import "./Cards.scss";
import "./Login.scss";

export interface State {
    isLoading: boolean;
    email: string;
    password: string;
    aws_login_error?: string;
    aws_google_error?: string;
}

export default class Login extends Component<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {
            isLoading: false,
            email: "",
            password: "",
        }
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
            this.setState({ aws_login_error: e.message })
            this.setState({ isLoading: false });
        }
    }

    async googleLogin() {
        try {
            await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
        } catch (e) {
            this.setState({ aws_google_error: e.message })
        }
    }

    renderGoogleError() {
        return (
            <Alert variant="danger" className="center-card" style={{ marginTop: '10px' }} >
                {this.state.aws_google_error}
            </Alert>
        );
    }

    render() {
        return (
            <div>
                <Card className="center-card" style={{ width: '25rem' }}>
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
                                    isInvalid={this.state.aws_login_error !== undefined}
                                />
                                <Form.Text className="text-muted">
                                    Forgot your password? <Link to="/login/reset">Reset password</Link>
                                </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    {this.state.aws_login_error}
                                </Form.Control.Feedback>
                            </FormGroup>
                            <Form.Text className="text-muted" style={{ fontSize: '100%' }}>
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
                {this.state.aws_google_error && this.renderGoogleError()}
            </div>
        );
    }
}
