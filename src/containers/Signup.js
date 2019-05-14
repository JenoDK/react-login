import { Auth } from "aws-amplify";
import React, { Component } from "react";
import { Form } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Signup.scss";

export default class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            showErrors: false,
            username: "",
            error_username: "Please enter a username",
            email: "",
            error_email: "Please enter a valid e-mail adress",
            password: "",
            error_password: "Password needs to be min 8 characters and contain uppercase, lowercase letters and numbers",
            confirmPassword: "",
            error_confirmPassword: "Needs to be the same as Password",
            confirmationCode: "",
            error_awsCognito: "",
            newUser: null,
        };
    }

    validateForm() {
        return (
            this.state.username.length > 0 &&
            this.validateEmail() &&
            this.validatePassword() &&
            this.validateConfirmPassword()
        );
    }

    validatePassword() {
        var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        return (
            this.state.password.length > 0 && re.test(this.state.password)
        );
    }

    validateConfirmPassword() {
        return (
            this.state.password === this.state.confirmPassword
        );
    }

    validateEmail() {
        var re = /\S+@\S+\.\S+/;
        return (
            this.state.email.length > 0 && re.test(this.state.email)
        );
    }

    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ showErrors: true });
        if (this.validateForm()) {

            this.setState({ isLoading: true });

            try {
                const newUser = await Auth.signUp({
                    username: this.state.username,
                    password: this.state.password,
                    attributes: {
                        email: this.state.email,
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

    handleConfirmationSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
            await Auth.signIn(this.state.email, this.state.password);

            this.props.userHasAuthenticated(true);
            this.props.history.push("/");
        } catch (e) {
            alert(e.message);
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
                    block
                    disabled={!this.validateConfirmationForm()}
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Verify"
                    loadingText="Verifying…"
                />
            </form>
        );
    }

    renderForm() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={this.state.username}
                        onChange={this.handleChange}
                        isInvalid={this.state.showErrors && !this.validatePassword()}
                    />
                    <Form.Control.Feedback type="invalid">
                        {this.state.error_username}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        isInvalid={this.state.showErrors && !this.validateEmail()}
                    />
                    <Form.Control.Feedback type="invalid">
                        {this.state.error_email}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        value={this.state.password}
                        onChange={this.handleChange}
                        type="password"
                        isInvalid={this.state.showErrors && !this.validatePassword()}
                    />
                    <Form.Control.Feedback type="invalid">
                        {this.state.error_password}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                        type="password"
                        isInvalid={this.state.showErrors && !this.validateConfirmPassword()}
                    />
                    <Form.Control.Feedback type="invalid">
                        {this.state.error_confirmPassword}
                    </Form.Control.Feedback>
                </Form.Group>
                <LoaderButton
                    block
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Signup"
                    loadingText="Signing up…"
                />
            </form>
        );
    }

    render() {
        return (
            <div className="Signup">
                {this.state.newUser === null
                    ? this.renderForm()
                    : this.renderConfirmationForm()}
            </div>
        );
    }
}
