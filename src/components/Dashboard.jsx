import React, { useState, setState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, NavLink, Link } from 'react-router-dom';
//import { Tooltip, Toast, Popover } from 'bootstrap';
import { Button, Form, Container, Image, Row, Column, Col, Navbar, Nav, NavDropdown, Modal, ModalListGroup, ListGroupItem, InputGroup, FormControl, CloseButton } from 'react-bootstrap';
import axios from 'axios';

import Separator from './Separator';

const Dashboard = (props) => {
    const [showBuckit, setShowBuckit] = useState(false);
    const [titleInput, setTitleInput] = useState('');
    const [textInput, setTextInput] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [ratingInput, setRatingInput] = useState("0");
    const [separator, setSeparator] = useState([]);
    const [userID, setUserID] = useState('');
    
    const handleClose = () => setShowBuckit(false);
    const handleShow = () => setShowBuckit(true);

    // useEffect to send GET request to /api/home to render and load all buckit cards
    //you can give the useEffect a dependency, like shown on line 31
    useEffect(() => {
        axios.get(`/api/home/${props.userName}`).then((res) => {
            console.log('response', res);
            const newSeparator = res.data.map( el => <Separator 
                username={props.userName}
                userId={el.user_id}
                buckitId ={el.buckit_id} 
                titleInput={el.title} 
                textInput={el.description} 
                urlInput={el.url} 
                ratingInput={el.rating}
                />);
            setSeparator(newSeparator);
            setUserID(res.data[0].user_id);
            // console.log('this is our new separator:', newSeparator)
        })
        .catch((err) => console.error('ERR: ', err));
    }, []);

    const fetchData = () => {

        //post request to add a buckit item  to the database
        axios
            .post('/api/addBuckit', {
                title: titleInput,
                text: textInput,
                url: urlInput,
                rating: ratingInput,
                user_id: userID
            })
            .then((res) => {
                console.log('response*******',res);
                document.getElementById('inputField1').value = '';
                document.getElementById('inputField2').value = '';
                document.getElementById('inputField3').value = '';
                document.getElementById('inputField4').value = '0';
                // location.reload();
            })
        //     .then((res) =>  { res.data.map( el => {<Separator titleInput={el.title} textInput={el.description} urlInput={el.url} ratingInput={el.rating} />})
        // })
            .catch((err) => console.error('ERR: ', err));
    };

                



    //Revisit this: how do we render a new buckit card without reloading the page? 
    const handleSubmit = (event) => {
        // console.log('we are consoling the event');
        fetchData();

        const buckit = {
            title: titleInput,
            text: textInput,
            url: urlInput,
            rating: ratingInput,
            user_id: userID
        }

        const newSeparator = separator.push(buckit);
        setSeparator(newSeparator);
        setShowBuckit(false);
        location.reload();
        event.preventDefault();

      };

    return (
        //Bootstrap(?) Navbar
        <Container fluid className="dashboard border rounded border-dark">
            <Navbar collapseOnSelect className="fixed-top" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/home">Buckit</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Button variant="secondary" onClick={() => handleShow(true)}>
                                Create Buckit
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className = "Container">{separator}</div>

            {/* {buckitList} */}

            <Form id="buckitForm">
                <Modal id="buckitModal" show={showBuckit} onHide={handleClose} backdrop="static" keyboard={false} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>New Buckit</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Control id='inputField1' type="text" placeholder="Enter Title"    onChange={(e) => setTitleInput(e.target.value)}
              value={titleInput}/>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Control  id='inputField2' className="mt-2" as="textarea" placeholder="Enter Description" rows={3} onChange={(e) => setTextInput(e.target.value)}
              value={textInput}/>
                        </Form.Group>
                        <InputGroup>
                            <Form.Control  id='inputField3' className="mb-2" size="sm" type="url" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Share URL" onChange={(e) => setUrlInput(e.target.value)}
              value={urlInput}/>
                        </InputGroup>
                        <Row>
                            <Col>
                                <Form.Select id="inputField4" onSelect={(e) => setRatingInput(e.target.value)}>
                                    <option value="0">Rating</option>
                                    <option value="5">⭐⭐⭐⭐⭐</option> 
                                    <option value="4">⭐⭐⭐⭐</option> 
                                    <option value="3">⭐⭐⭐</option> 
                                    <option value="2">⭐⭐</option>
                                    <option value="1">⭐</option>
                                </Form.Select>
                            </Col>
                            <Col></Col>
                            <Col></Col>
                            <Col></Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className="d-grid gap-2">
                        <Button variant="primary" type='submit' onClick={handleSubmit}>Confirm</Button>
                    </Modal.Footer>
                </Modal>
            </Form>
        </Container>
    );
};

export default Dashboard;

