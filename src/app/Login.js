import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { setAccessToken } from '../features/map/mapSlice'
import { useAccessToken } from './AccessTokenProvider'


export const isValidToken = async (token) => {

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=${token}`

    const valid = await fetch(url).then((response) => {
        if (response.status >= 400 && response.status < 600) {
            return false
        }
        return true;
    }).catch((error) => {
        return false
    });

    return valid
}


export const Login = () => {

    const [token, setToken] = useState('')
    const [valid, setValid] = useState(true)
    const dispatch = useDispatch()
    const { onSetAccessToken } = useAccessToken()

    const handleChangeAccessToken = (event) => {
        const { target: { value } } = event
        setToken(value)
    }

    const handleSetAccessToken = async () => {
        if (await isValidToken(token)) {
            setValid(true)
            dispatch(setAccessToken(token))
            onSetAccessToken(token)
        } else {
            setValid(false)
        }
    }


    return (
        <div id="login-jumbotron" className="bg-light rounded m-5">
            <div id="login-jumbotron-text" className="rounded p-3">
                <h1 className="display-4">Hallo Besucher!</h1>
                <p className="lead">
                    Auf dieser Seite können Sie diverse für die Feuerwehr nützliche Dienste nutzen
                </p>
                <hr className="my-4" />
                <p>
                    Um diese Seite nutzen zu können, benötigen Sie einen gültigen Mapbox
                    AccessToken mit Zugang zur Optimization API v2. Mapbox Karte und API lassen sich ohne AccessToken nicht nutzen.
                </p>
                <InputGroup size="lg">
                    <Form.Control id="accessToken"
                        value={token} onChange={handleChangeAccessToken}
                        placeholder="AccessToken hier eintragen"
                        isInvalid={!valid} />
                    {!valid && <Form.Text>Invalider AccessToken</Form.Text>}
                    <Button variant="dark" onClick={handleSetAccessToken}>OK</Button>
                </InputGroup>
            </div>
        </div>
    )

}

export default Login