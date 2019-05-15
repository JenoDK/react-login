import React, { Component } from "react";
import "./Home.scss";
import { Jumbotron, Container } from "react-bootstrap";

export default class Home extends Component {
    render() {
        return (
            <Jumbotron fluid className="Home">
                <Container className="lander">
                    <h1>Scratch</h1>
                    <p>A simple note taking app</p>
                </Container>
            </Jumbotron>
        );
    }
}
