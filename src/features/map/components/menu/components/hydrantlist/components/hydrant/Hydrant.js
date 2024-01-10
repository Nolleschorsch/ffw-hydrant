import React from 'react'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Eye } from 'react-bootstrap-icons'
import { useDispatch } from 'react-redux'
import { editHydrant, setHydrantDraft } from './index'

export const Hydrant = (props) => {

    const dispatch = useDispatch()

    const { hydrant, unsaved, index } = props

    const [shortName, ..._] = hydrant.name.split(',')

    const handleClick = event => {
        dispatch(setHydrantDraft(hydrant))
    }

    const handleChangeName = event => {
        const modifiedHydrant = Object.assign({}, { ...hydrant }, { name: event.target.value })
        dispatch(editHydrant({ index, modifiedHydrant }))
    }

    const style = unsaved ? { color: 'red' } : { color: 'green' }

    return (
        <div className="p-2" style={style} data-testid='hydrant-component' >
            <InputGroup>
                <Button onClick={handleClick} ><Eye /></Button>
                <Form.Control value={shortName} onChange={handleChangeName} isInvalid={unsaved} />
            </InputGroup>
        </div>
    )

}

export default Hydrant