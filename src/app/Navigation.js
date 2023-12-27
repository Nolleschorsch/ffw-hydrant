import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavItem from 'react-bootstrap/NavItem'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Button from 'react-bootstrap/Button'

export const Navigation = (props) => {
    return (
        <>
            <Navbar fixed="sticky" expand={false} className="mb-3"
                variant="ffw" bg="ffw" id="navbar">
                <Container fluid>
                    <Navbar.Brand href="#">Navbar Offcanvas</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Offcanvas
                        placement="end"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>
                                Offcanvas
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="justify-content-end flex-grow-1 pe-3">
                            
                                    <Link className="nav-link" to="/">Home</Link>
                               
                                <NavItem>
                                    <Link className="nav-link" to="/hydrant">Hydrant</Link>
                                </NavItem>
                               {/*  <Link className='nav-link' to='/openfiremap'>OpenFireMap</Link> */}
                                {/* <Nav.Link href="#action1">Home</Nav.Link>
                            <Nav.Link href="#action2">Link</Nav.Link> */}
                                <NavDropdown
                                    title="Dropdown"
                                >
                                    <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                                    <NavDropdown.Item href="#action4">
                                        Another action
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action5">
                                        Something else here
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                            {/* <Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-success">Search</Button>
                    </Form> */}
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
            <Outlet />
        </>
    )
}


export default Navigation