import React from 'react'
import { screen, cleanup } from '@testing-library/react';
//import { useDispatch, useSelector } from 'react-redux';
import { renderWithProviders } from '../../test-utils';
import Hydrant from './Hydrant'
import userEvent from '@testing-library/user-event';
import { editHydrant } from './mapSlice';

/* jest.mock('react-redux', () => {
    const originalModule = jest.requireActual('react-redux');

    return {
        __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        useDispatch: jest.fn(),
        useSelector: jest.fn()
    };
}) */

jest.mock('./mapSlice', () => ({
    __esModule: true,
    ...jest.requireActual('./mapSlice'),
    editHydrant: jest.fn()
}))

describe('Hydrant Component', () => {

    afterEach(() => {
        cleanup()
    })

    it('can render', async () => {

        const div = document.createElement('div')
        const props = {
            hydrant: {name: 'foo', lat: 1, lng: 1, id: 1, active: true},
            unsaved: true,
            index: 0,
            marker: {togglePopup: jest.fn()}
        }

        const { container } = renderWithProviders(<Hydrant {...props} />, {
            container: document.body.appendChild(div),
        })

        const nameInput = await screen.findByDisplayValue('foo')
        expect(nameInput).toBeTruthy()
    })

    it('Button click triggers handleClick', async () => {

        const togglePopup = jest.fn()

        const div = document.createElement('div')
        const props = {
            hydrant: {name: 'foo', lat: 1, lng: 1, id: 1, active: true},
            unsaved: true,
            index: 0,
            marker: {togglePopup}
        }

        const { container } = renderWithProviders(<Hydrant {...props} />, {
            container: document.body.appendChild(div),
        })

        const btn = await screen.findByRole('button')
        await userEvent.click(btn, {delay: null})
        expect(togglePopup).toHaveBeenCalled()
    })

    it('handleChangeName', async () => {

        editHydrant.mockImplementation(() => ({
            type: '',
            payload: {}
        }))

        const div = document.createElement('div')
        const props = {
            hydrant: {name: 'foo', lat: 1, lng: 1, id: 1, active: true},
            unsaved: true,
            index: 0,
            marker: {togglePopup: jest.fn()}
        }
        // wrap component with custom render function

        const { container } = renderWithProviders(<Hydrant {...props} />, {
            container: document.body.appendChild(div),
        })

        const nameInput = await screen.findByDisplayValue('foo')
        //expect(nameInput).toBeTruthy()
        const modifiedHydrant = Object.assign({}, {...props.hydrant}, {name: 'foob'})
        await userEvent.type(nameInput, 'b'), {delay: null}
        expect(editHydrant).toHaveBeenCalledWith({index: props.index, modifiedHydrant})
    })
})