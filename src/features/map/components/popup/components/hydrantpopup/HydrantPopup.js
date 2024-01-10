import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import './HydrantPopup.css'

export const HydrantPopup = props => {

    const { index, changeName, confirm, abort, remove, ...hydrant } = props
    const { name, lng, lat, active } = hydrant

    const [show, setShow] = useState(false)

    const handleChangeName = event => {
        changeName(event.target.value)
    }

    const handleConfirm = event => {
        confirm()
    }

    const handleAbort = event => {
        abort()
    }

    const handleDelete = event => {
        setShow(false)
        remove(index)
    }

    const handleShow = event => {
        setShow(true)
    }

    return (
        <>
            <Card>
                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                <Card.Body>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="hydrant-pop-name">Hydrantbezeichnung</Form.Label>
                        <Form.Control id="hydrant-pop-name" value={name}
                            onChange={handleChangeName} placeholder="Hydrantbezeichnung eintragen" />

                    </Form.Group>

                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Lng</Form.Label>
                            <Form.Control placeholder="Längengrad eintragen" disabled value={lng} />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>Lat</Form.Label>
                            <Form.Control placeholder="Breitengrad eintragen" disabled value={lat} />
                        </Form.Group>
                    </Row>
                    <Form.Check type="switch" label="Aktiv" value={active} disabled />
                    <Button variant="primary" onClick={handleConfirm}>OK</Button>
                    <Button variant="secondary" onClick={handleAbort}>Abbruch</Button>
                    <Button variant="danger" disabled={index === undefined}
                        onClick={handleShow}>Löschen</Button>
                </Card.Body>
            </Card>
            <Modal show={show} onHide={() => setShow(false)} data-testid='delete-hydrant-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Hydrant Löschen Bestätigung</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {JSON.stringify(hydrant)}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Abbrechen
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Löschen bestätigen
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}


export default HydrantPopup