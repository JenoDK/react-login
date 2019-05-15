import { ISignUpResult } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";
import React, { Component } from "react";
import { Form, FormControlProps, Card } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import LoaderButton from "../components/LoaderButton";
import "./Cards.scss";
import { Link } from 'react-router-dom';

export interface MainState {
    isLoading: boolean;
    showErrors: boolean;
    newUser?: ISignUpResult;
    errors: Errors;
    formState: FormState;
    confirmationCode?: string;
}

export interface FormState {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export interface Errors {
    error_username?: string;
    error_email?: string;
    error_password?: string;
    error_confirmPassword?: string;
    error_awsCognito?: string;
}

export default class Signup extends Component<RouteComponentProps<any>, MainState> {
    constructor(props: RouteComponentProps<any>) {
        super(props);

        this.state = {
            isLoading: false,
            showErrors: false,
            errors: {
                error_username: "Please enter a username",
                error_email: "Please enter a valid e-mail adress",
                error_password: "Password needs to be min 8 characters and contain atleast one uppercase and lowercase letter and one number",
                error_confirmPassword: "Needs to be the same as password",
                error_awsCognito: ""
            },
            formState: {}
        };
    }

    validateForm(): boolean {
        return (
            this.validateUsername() &&
            this.validateEmail() &&
            this.validatePassword() &&
            this.validateConfirmPassword()
        ) as boolean;
    }

    validateUsername = (): boolean => (this.state.formState.username !== undefined && this.state.formState.username.length > 0);

    validatePassword(): boolean {
        var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        return (
            this.state.formState.password !== undefined && this.state.formState.password.length > 0 && re.test(this.state.formState.password)
        );
    }

    validateConfirmPassword(): boolean {
        return (
            this.state.formState.password !== undefined && this.state.formState.confirmPassword !== undefined && 
            this.state.formState.password === this.state.formState.confirmPassword
        );
    }

    validateEmail(): boolean {
        var re = /\S+@\S+\.\S+/;
        return (
            this.state.formState.email !== undefined && this.state.formState.email.length > 0 && re.test(this.state.formState.email)
        );
    }

    validateConfirmationForm(): boolean {
        return (
            this.state.confirmationCode !== undefined && this.state.confirmationCode.length > 0
        );
    }

    handleChange = (event: React.FormEvent<FormControlProps>) => {
        if (event.currentTarget.id) {
            this.setState({ formState: { ...this.state.formState, [event.currentTarget.id] : event.currentTarget.value} });
        }
    }

    /**
     * Handles sign up form submission
     * @param {React.FormEvent<HTMLFormElement>} e - The form event
     */
    handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        this.setState({ showErrors: true });
        if (this.validateForm()) {
            this.setState({ isLoading: true });
            try {
                const newUser = await Auth.signUp({
                    username: this.state.formState.username ? this.state.formState.username : "",
                    password: this.state.formState.password ? this.state.formState.password : "",
                    attributes: {
                        email: this.state.formState.email ? this.state.formState.email : "",
                    }
                });
                this.setState({
                    newUser
                });
            } catch (e) {
                alert(e.message);
                console.log(e);
            }

            this.setState({ isLoading: false });
        }
    }

    /**
     * Handles confirmation form submission
     * @param {React.FormEvent<HTMLFormElement>} e - The form event
     */
    handleConfirmationSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        this.setState({ isLoading: true });
        try {
            if (this.state.formState.email && this.state.formState.password && this.state.confirmationCode) {
                await Auth.confirmSignUp(this.state.formState.email, this.state.confirmationCode);
                await Auth.signIn(this.state.formState.email, this.state.formState.password);
                this.props.history.push("/");
            } else {
                console.error("Form's state contained missing email, password or confirmationCode")
            }
        } catch (e) {
            console.error(e.message);
            this.setState({ isLoading: false });
        }
    }

    renderConfirmationForm() {
        return (
            <form onSubmit={this.handleConfirmationSubmit}>
                <Form.Group controlId="confirmationCode">
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control
                        autoFocus
                        type="tel"
                        value={this.state.confirmationCode}
                        onChange={this.handleChange}
                    />
                    <Form.Text>Please check your email for the code.</Form.Text>
                </Form.Group>
                <LoaderButton
                    disabled={!this.validateConfirmationForm()}
                    isLoading={this.state.isLoading}
                    text="Verify"
                    loadingText="Verifying…"
                />
            </form>
        );
    }

    renderForm() {
        return (
            <Card className="center-card" >
                <Card.Header as="h5">Sign up</Card.Header>
                <Card.Body>
                    <form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                autoFocus
                                type="text"
                                onChange={this.handleChange}
                                isValid={this.state.showErrors && this.validateUsername()}
                                isInvalid={this.state.showErrors && !this.validateUsername()}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.state.errors.error_username}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                autoFocus
                                type="email"
                                onChange={this.handleChange}
                                isValid={this.state.showErrors && this.validateEmail()}
                                isInvalid={this.state.showErrors && !this.validateEmail()}
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                            <Form.Control.Feedback type="invalid">
                                {this.state.errors.error_email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                onChange={this.handleChange}
                                type="password"
                                isValid={this.state.showErrors && this.validatePassword()}
                                isInvalid={this.state.showErrors && !this.validatePassword()}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.state.errors.error_password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                onChange={this.handleChange}
                                type="password"
                                isValid={this.state.showErrors && this.validateConfirmPassword()}
                                isInvalid={this.state.showErrors && !this.validateConfirmPassword()}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.state.errors.error_confirmPassword}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Text className="text-muted" style={{ fontSize: '100%' }}>
                            Already have an account? <Link to="/login">Sign in</Link>
                        </Form.Text>
                        <LoaderButton
                            isLoading={this.state.isLoading}
                            text="Signup"
                            loadingText="Signing up…"
                        />
                    </form>
                </Card.Body>
            </Card>
        );
    }

    render() {
        return (
            <div className="Signup">
                {this.state.newUser
                    ? this.renderConfirmationForm()
                    : this.renderForm()}
            </div>
        );
    }
}
