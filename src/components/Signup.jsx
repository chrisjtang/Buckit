import React, { useState } from 'react';
//import { Tooltip, Toast, Popover } from 'bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import { Button, Form, Container, Image, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Signup = () => {
  const [usernameInput, setUsername] = useState('');
  const [passwordInput, setPassword] = useState('');
  const [navigateLogin, setNavigateLogin] = useState(false);

  /*todo:
  - on successful acct creation, show message and render redirect button to login.
  */
  const createAccount = async () => {
    try {
      const apiCall = await axios.post('/api/signup', {
        "userId": `${uuidv4()}`,
        "username": `${usernameInput}`,
        "password": `${passwordInput}`,
      });
      //on successful acct creation, show message and render redirect button to login.  apiCall.status would be 200
      if (apiCall.status === 200) {
        console.log('successful status 200');
      }
    } catch {
      window.alert('Error with your entry.  The username you chose may already be taken.  Please try again.');
    }
  };

  const handleSubmit = (event) => {
    console.log('submit button clicked');
    event.preventDefault();
    createAccount();
  };

  const loginButton = () => Login;

  return (
    <Container fluid className="login">
      <div className="loginCard">
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
              onChange={(e) => setPassword(e.target.value)}
              value={passwordInput}
            />
          </Form.Group>
          <Form.Group className="d-grid gap-2">
            <Button variant="primary" type="submit">
              Confirm
            </Button>
            <Button variant="info" type="">
            <Link to='/login'>
              Success!  Click here to login
            </Link>
            </Button>
          </Form.Group>
          
        </Form>
      </div>
    </Container>
  );
};

export default Signup;
