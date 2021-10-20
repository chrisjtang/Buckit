import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, NavLink, Link } from 'react-router-dom';
import { Button, Form, Container, Image, Row, Column, Col, Card, ListGroup, ListGroupItem, InputGroup, FormControl, CloseButton, Modal } from 'react-bootstrap';

const Buckit = (props) => {
    console.log('props', props);

    return (
        <Card variant="Light" border="primary" style={{ width: '18rem' }}>
            <h4 className="rating">{props.ratingInput}⭐</h4> 
            <Card.Body>
                <Card.Title style={{color: "black"}}>{props.titleInput}</Card.Title>
                <hr className="solid" />
                <Card.Text style={{color: "black"}}>{props.textInput}</Card.Text>
                <Card.Link href={props.urlInput}>{props.urlInput}</Card.Link>
            </Card.Body>
        </Card>
                    
    );
};

export default Buckit;
//d-flex justify-content-end <== line 11. what the fuck are yoU/
//Tim sin iq is so fucking high