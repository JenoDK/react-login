import { Auth } from "aws-amplify";
import React, { Component } from "react";
import { Alert, Form, FormControl, FormControlProps, FormGroup, Card } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Cards.scss";
import { Link } from "react-router-dom";

export interface ResetPasswordState {
    code: string;
    email: string;
    password: string;
    codeSent: boolean;
    confirmed: boolean;
    confirmPassword: string;
    isConfirming: boolean;
    isSendingCode: boolean;
}

export default class ResetPassword extends Component<{}, ResetPasswordState> {
    state: ResetPasswordState = {
        code: "",
        email: "",
        password: "",
        codeSent: false,
        confirmed: false,
        confirmPassword: "",
        isConfirming: false,
        isSendingCode: false
    };

    validateCodeForm() {
        return this.state.email.length > 0;
    }

    validateResetForm() {
        return (
            this.state.code.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
        );
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
    handleSendCodeClick = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        this.setState({ isSendingCode: true });

        try {
            await Auth.forgotPassword(this.state.email);
            this.setState({ codeSent: true });
        } catch (e) {
            console.log(e.message);
            this.setState({ isSendingCode: false });
        }
    }

    /**
     * Handles form submission
     * @param {React.FormEvent<HTMLFormElement>} e - The form event
     */
    handleConfirmClick = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        this.setState({ isConfirming: true });

        try {
            await Auth.forgotPasswordSubmit(
                this.state.email,
                this.state.code,
                this.state.password
            );
            this.setState({ confirmed: true });
        } catch (e) {
            console.log(e.message);
            this.setState({ isConfirming: false });
        }
    }

    renderRequestCodeForm() {
        return (
            <Card className="center-card" >
                <Card.Header as="h5">Reset password</Card.Header>
                <Card.Body>
                    <form onSubmit={this.handleSendCodeClick}>
                        <FormGroup controlId="email">
                            <Form.Label>Email</Form.Label>
                            <FormControl
                                autoFocus
                                type="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <LoaderButton
                            loadingText="Sending…"
                            text="Send Confirmation"
                            isLoading={this.state.isSendingCode}
                            disabled={!this.validateCodeForm()}
                        />
                    </form>
                </Card.Body>
            </Card>
        );
    }

    renderConfirmationForm() {
        return (
            <Card className="center-card" >
                <Card.Header as="h5">Reset password</Card.Header>
                <Card.Body>
                    <form onSubmit={this.handleConfirmClick}>
                        <FormGroup controlId="code">
                            <Form.Label>Confirmation Code</Form.Label>
                            <FormControl
                                autoFocus
                                type="tel"
                                value={this.state.code}
                                onChange={this.handleChange}
                            />
                            <Form.Text>
                                Please check your email ({this.state.email}) for the confirmation
                                code.
                    </Form.Text>
                        </FormGroup>
                        <hr />
                        <FormGroup controlId="password">
                            <Form.Label>New Password</Form.Label>
                            <FormControl
                                type="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <FormControl
                                type="password"
                                onChange={this.handleChange}
                                value={this.state.confirmPassword}
                            />
                        </FormGroup>
                        <LoaderButton
                            text="Confirm"
                            loadingText="Confirm…"
                            isLoading={this.state.isConfirming}
                            disabled={!this.validateResetForm()}
                        />
                    </form>
                </Card.Body>
            </Card>
        );
    }

    renderSuccessMessage() {
        return (
            <Card className="center-card" >
                <Card.Header as="h5">Reset password</Card.Header>
                <Card.Body>
                    <Alert variant="success">
                        Your password has been reset.<br/>
                        <Link to="/login">Click here</Link> to sign in.
                    </Alert>
                </Card.Body>
            </Card>
        );
    }

    render() {
        return (
            <div className="ResetPassword">
                {!this.state.codeSent
                    ? this.renderRequestCodeForm()
                    : !this.state.confirmed
                        ? this.renderConfirmationForm()
                        : this.renderSuccessMessage()}
            </div>
        );
    }
}
