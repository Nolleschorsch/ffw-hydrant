import React from 'react'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { useDispatch, useSelector } from 'react-redux'
import { setShow } from './index'


export const ToastService = () => {

    const dispatch = useDispatch()
    const toastState = useSelector(state => state.toastService)
    const { show, toastTitle, toastTxt, bg } = toastState

    return (
        <ToastContainer position='bottom-end' data-testid='toast-container'>
            <Toast onClose={() => dispatch(setShow(false))} show={show} delay={5000}
                autohide bg={bg} data-testid='toast'>
                <Toast.Header>
                    <strong className="me-auto">{toastTitle}</strong>
                </Toast.Header>
                <Toast.Body>{toastTxt}</Toast.Body>
            </Toast>
        </ToastContainer>
    )

}


export default ToastService