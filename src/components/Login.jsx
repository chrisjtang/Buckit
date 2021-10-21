import React, { useState } from 'react';
//import { Tooltip, Toast, Popover } from 'bootstrap';
import { Button, Form, Container, Image, Row, Column, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../img/buckitimg.png'

const Login = () => {
    const [usernameInput, setUsername] = useState('');
    const [passwordInput, setPassword] = useState('');
    const [loginVerify, setloginVerify] = useState(false);

    //currently, there is no route to handle the /api/login endpoint
    const fetchData = () => {
        axios
        // needs to be a post request so that axios can send request body in the config object's data property.
            .post('/api/login/', {
                data: {
                    username: usernameInput,
                    password: passwordInput,
                }
            })
            .then((res) => {
              if (res.status === 204) {
                setloginVerify(e => e = true)
                return <Link to={{ pathname: '/home',
                state: {username: usernameInput},
              }}/>
                // window.location = `/home/${usernameInput}`;
              }
              if (res.status === 205) {
                  console.log('Invalid username/password');
              }
            })
            // .then((data) => console.log('DATA: ', data))
            // this.state.loginVerify = true;
            // if (this.state.loginVerify === true) {return (<Redirect to ="/home" />)};
            .catch((err) => console.error('ERR: ', err));

            
    };

    

    const handleLogin = () => {
        event.preventDefault();
        fetchData();
    }
    // if (res.locals.userVerified === true) {return (<Redirect to ="/home" />)}
    return (
        <Container fluid className="login">
            <div className="loginCard">
            <Image src={logo} fluid />
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter Username *" onChange={(e) => setUsername(e.target.value)} value={usernameInput} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter Password *" onChange={(e) => setPassword(e.target.value)} value={passwordInput} />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Button className="mb-2 pull-right" variant="primary" type="submit" onClick={handleLogin}>
                                Sign In
                            </Button>
                        </Col>
                        <Col></Col>
                        <Col></Col>
                    </Row>
                    <div className="mt-4">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default Login;
