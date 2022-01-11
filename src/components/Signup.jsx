import React, { useState } from 'react';
//import { Tooltip, Toast, Popover } from 'bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import { Alert, Button, Form, Container, Image, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Signup = () => {
  const [usernameInput, setUsername] = useState('');
  const [passwordInput, setPassword] = useState('');
  const [navigateLogin, setNavigateLogin] = useState(false);
  const [showError, setShowError] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);
  
  const createAccount = async () => {
    try {
      const apiCall = await axios.post('/api/signup', {
        "userId": `${uuidv4()}`,
        "username": `${usernameInput}`,
        "password": `${passwordInput}`,
      });
      //on successful acct creation, show message and render redirect button to login.
      setShowError(false);
      setNavigateLogin(true);
      setUsername('');
      setPassword('');
    } catch {
      setShowError(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createAccount();
  };

  return (
    <Container fluid className="login">
      <div className="loginCard">
      <h1>Sign Up Page</h1>
      <br></br>
        <Form onSubmit={handleSubmit}>
          <Form.Label>Create Username<span class="text-danger"> *</span></Form.Label>
          <Form.Group className="mb-3">
            <Form.Control
              className="form-control"
              type="username"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              value={usernameInput}
            />
          </Form.Group>
          <Form.Label>Create Password<span class="text-danger"> *</span></Form.Label>
          <Form.Group className="mb-3">
            <Form.Control
              className="form-control"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => {
                setPassword(e.target.value);
                setDisableSubmit(false);
              }}
              value={passwordInput}
            />
          </Form.Group>
          <Form.Group className="d-grid gap-2">
            <Button variant="primary" type="submit" disabled={disableSubmit}>
              Confirm
            </Button>
            <Button className='login-button' style={{visibility: navigateLogin ? 'visible' : 'hidden' }} variant="info" type="">
            <Link to='/login'>
              Success!  Click here to go to login
            </Link>
            </Button>
          </Form.Group>
          
        </Form>
      <Alert className='alert' style={{visibility: showError ? 'visible' : 'hidden'}} variant="danger" onClose={() => setShowError(false)} dismissible>
        <Alert.Heading>Error!</Alert.Heading>
        <p>Username taken. Please try again with a different username.</p>
      </Alert>
      </div>
    </Container>
  );
};

export default Signup;
