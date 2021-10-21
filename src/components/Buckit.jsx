import React, { useState, setState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, NavLink, Link } from 'react-router-dom';
import { Button, Form, Container, Image, Row, Column, Col, Card, ListGroup, ListGroupItem, InputGroup, FormControl, CloseButton, Modal } from 'react-bootstrap';
import axios from 'axios';


const Buckit = (props) => {
    const [showBuckit, setShowBuckit] = useState(false);
    const [titleInput, setTitleInput] = useState(props.titleInput);
    const [textInput, setTextInput] = useState(props.textInput);
    const [urlInput, setUrlInput] = useState(props.urlInput);
    const [ratingInput, setRatingInput] = useState(props.ratingInput);

    const handleClose = () => setShowBuckit(false);
    const handleShow = () => setShowBuckit(true);

    
    console.log('buckit props', props);
    //function to send delete call to the server
    const deleteBuckit = () => {
        console.log('clicked the delete button')
        console.log('PROPS+BUCKITID******',props.buckitId);
        axios.delete(`api/home/${props.username}`, {
            headers: {
            },
            data: {
                buckit_id: props.buckitId
            }
        })
        .then(() => {
            location.reload();
        })
        .catch((err) => {
            console.log(err, "an error occurred with the delete");
        });
    };

    const editBuckit = () => {
        handleClose();
        axios.patch(`api/home/${props.username}`, {
            title: titleInput,
            text: textInput,
            url: urlInput,
            rating: ratingInput,
            user_id: props.userId,
            buckit_id: props.buckitId
        })
        .then(() => {
            console.log('Patched successfully');
        })
        .catch(err => {
            console.log('patch error', err);
        });
    }

    return (
        <Card className="buckitCard" variant="Light" border="primary" style={{ width: '18rem' }}>
            <h4 className="rating">{ratingInput}⭐</h4> 
            <Card.Body>
                <Card.Title style={{color: "black"}}>{titleInput}</Card.Title>
                <hr className="solid" />
                <Card.Text style={{color: "black"}}>{textInput}</Card.Text>
                <Card.Link href={props.urlInput}>{urlInput}</Card.Link>
                <div id='cardBtn'>
                    <Button variant="outline-danger" onClick={deleteBuckit}>Delete</Button>
                    <Button variant="outline-secondary" onClick={handleShow}>Edit</Button>
                </div>
            </Card.Body>
            
                    
        <Form id="editForm">
                <Modal id="editModal" show={showBuckit} onHide={handleClose} backdrop="static" keyboard={false} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Buckit</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Control id='editField1' type="text" placeholder={props.titleInput}    onChange={(e) => setTitleInput(e.target.value)}
              value={titleInput}/>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Control  id='editField2' className="mt-2" as="textarea" placeholder="Enter Description" rows={3} onChange={(e) => setTextInput(e.target.value)}
              value={textInput}/>
                        </Form.Group>
                        <InputGroup>
                            <Form.Control  id='editField3' className="mb-2" size="sm" type="url" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Share URL" onChange={(e) => setUrlInput(e.target.value)}
              value={urlInput}/>
                        </InputGroup>
                        <Row>
                            <Col>
                                <Form.Select id="editField4" onChange={(e) => setRatingInput(e.target.value)}>
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
                        <Button variant="primary" type='submit' onClick={editBuckit}>Confirm</Button>
                    </Modal.Footer>
                </Modal>
            </Form>
        </Card>
    );
};

export default Buckit;
//d-flex justify-content-end <== line 11. what the fuck are yoU/
//Tim sin iq is so fucking high