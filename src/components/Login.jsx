import React, { useState } from 'react';
//import { Tooltip, Toast, Popover } from 'bootstrap';
import { Alert, Button, Form, Container, Image, Row, Column, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../img/buckitimg.png'

const Login = () => {
    const [usernameInput, setUsername] = useState('');
    const [passwordInput, setPassword] = useState('');
    const [userVerified, setUserVerified] = useState();
    const [showError, setShowError] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(true);

    const fetchData = async () => {
        try {
            const serverRequest = await axios.post('/api/login', {
            "username": `${usernameInput}`,
            "password": `${passwordInput}`,
            });
            console.log('server request data',serverRequest.status);
            if (serverRequest.status === 205) {
                setUserVerified(true);
                setShowError(false);
            } else {
                setUserVerified(false);
            }
        } catch {
            setShowError(true);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchData();
    };

    return (
        <Container fluid className="login">
            <div className="loginCard">
            <Image src={logo} fluid />
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter Username *" onChange={(e) => setUsername(e.target.value)} value={usernameInput} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter Password *" onChange={(e) => {
                            setPassword(e.target.value);
                            setDisableSubmit(false);
                            }} value={passwordInput} />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Button className="mb-2 pull-right" variant="primary" type="submit" disabled={disableSubmit}>
                                Sign In
                            </Button>
                        </Col>
                            <div className="mt-4">
                                Don't have an account? <Link to="/signup">Sign Up</Link>
                            </div>
                        <Button variant="primary" type="submit" className='login-button' style={{visibility: userVerified ? 'visible' : 'hidden' }} variant="info" type="" >
                        <Link to={{ pathname: '/home',
                            state: {username: usernameInput}}} >
                            Successful login! Click here to enter dashboard.
                        </Link>
                        </Button>
                        <Col></Col>
                        <Col></Col>
                    </Row>
                </Form>
                <Alert className='alert' style={{visibility: showError ? 'visible' : 'hidden'}} variant="danger" onClose={() => setShowError(false)} dismissible>
                <Alert.Heading>Error!</Alert.Heading>
                 <p>Credentials incorrect.  Please try again.</p>
      </Alert>
            </div>
        </Container>
    );
};

export default Login;
