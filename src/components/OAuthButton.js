import { withOAuth } from 'aws-amplify-react';
import React from 'react';
import { Button } from 'react-bootstrap';
import { Auth } from 'aws-amplify';

class OAuthButton extends React.Component {
    render() {
        return (
            <Button onClick={this.props.OAuthSignIn}>
                Sign in with Google!
            </Button>
        )
    }
}

export default withOAuth(OAuthButton);