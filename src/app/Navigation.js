import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavItem from 'react-bootstrap/NavItem'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Button from 'react-bootstrap/Button'

export const Navigation = (props) => {

    const [menuOpen, setMenuOpen] = useState(false)
    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    const handleClose = () => setMenuOpen(false)

    return (
        <>
            <Navbar expand={false}
                variant="ffw" bg="ffw" id="navbar">
                <Container fluid>
                    <Navbar.Brand href="#" id="navbar-brand">
                        {/* <img
                            src="ffw_emblem.jpg"

                            className="d-inline-block align-top"
                            alt="React Bootstrap logo"
                        /> */}
                        FEUERWEHR
                    </Navbar.Brand>
                    <Navbar.Toggle onClick={toggleMenu} />
                    <Navbar.Offcanvas
                        show={menuOpen}
                        onHide={handleClose}
                        placement="end"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>
                                Navigation
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="justify-content-end flex-grow-1 pe-3">

                                <Link className="nav-link" to="/" onClick={toggleMenu}>Home</Link>

                                <NavItem>
                                    <Link className="nav-link" to="/hydrant" onClick={toggleMenu}>Hydrant</Link>
                                </NavItem>
                                <NavItem>
                                    <Link className='nav-link' to='/openfiremap' onClick={toggleMenu}>OpenFireMap</Link>
                                </NavItem>
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