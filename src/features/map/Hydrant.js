import React from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { Eye } from 'react-bootstrap-icons'
import { useDispatch } from 'react-redux'
import { editHydrant } from './mapSlice'

export const Hydrant = (props) => {

    const dispatch = useDispatch()



    const { hydrant, unsaved, index, marker } = props
    const [shortName, ..._] = hydrant.name.split(',')

    const handleClick = event => {
        //marker.addClassName('wrapper-highlight')
        //console.log(marker)
        //marker.addClassName('some-class');
        //marker.togglePopup()
        console.log('soon')
    }

    const handleChangeName = event => {
        const modifiedHydrant = Object.assign({}, { ...hydrant }, { name: event.target.value })
        dispatch(editHydrant({ index, modifiedHydrant }))
    }

    const style = unsaved ? { color: 'red' } : { color: 'green' }

    return (
        <div className="p-2" style={style} data-testid='hydrant-component' >
            <Form>
                <Row>
                    <Col xs={1}><Button onClick={handleClick}><Eye /></Button></Col>
                    <Col xs={8}><Form.Control value={shortName} onChange={handleChangeName} isInvalid={unsaved} /></Col>
                </Row>
            </Form>
            {shortName}

        </div>
    )

}

export default Hydrant