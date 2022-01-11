import React, { useState } from 'react';
//import { Tooltip, Toast, Popover } from 'bootstrap';
import { Button, Form, Container, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Signup = () => {
  const [usernameInput, setUsername] = useState('');
  const [passwordInput, setPassword] = useState('');

  const fetchData = () => {
    // console.log('clicked on submit');
    axios
      .post('/api/signup', {
        "userId": `${uuidv4()}`,
        "username": `${usernameInput}`,
        "password": `${passwordInput}`,
      })
      .then(() => {
        // window.location = '/';
      })
      .catch(err => console.error('ERR: ', err));
  };

  const handleSubmit = (event) => {
    console.log('clicked on submit button');
    event.preventDefault();
    fetchData();
  };

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
          </Form.Group>
        </Form>
        {Error}
      </div>
    </Container>
  );
};

export default Signup;
