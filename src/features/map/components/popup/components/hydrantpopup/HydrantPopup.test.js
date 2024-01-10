import React from 'react'
import { render, screen, cleanup, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HydrantPopup from './HydrantPopup'

describe('HydrantPopup', () => {

    afterEach(() => {
        cleanup()
    })

    it('can render', () => {
        const props = {
            name: 'foo',
            lng: 1,
            lat: 1,
            active: true,
            index: 0,
            dispatchEditHydrant: () => { }
        }
        render(<HydrantPopup {...props} />)
        //expect(screen.queryByRole('button', {name: 'Strecke teilen'})).toBeFalsy()
    })
    it('change name', async () => {
        const props = {
            name: 'foo',
            lng: 1,
            lat: 1,
            active: true,
            index: 0,
            dispatchEditHydrant: jest.fn()
        }

        render(<HydrantPopup {...props} />)

        const nameInput = await screen.findByLabelText('Hydrantbezeichnung')
        expect(nameInput.value).toEqual('foo')
        await userEvent.type(nameInput, 'bar')
        expect(nameInput.value).toEqual('foobar')

    })

    it('OK Button click', async () => {
        const props = {
            name: 'foo',
            lng: 1,
            lat: 1,
            active: true,
            index: 0,
            dispatchEditHydrant: jest.fn()
        }

        render(<HydrantPopup {...props} />)
        await userEvent.click(await screen.findByRole('button', { name: 'OK' }))
        expect(props.dispatchEditHydrant).toHaveBeenCalledWith(
            {
                index: props.index, modifiedHydrant: {
                    name: 'foo',
                    lng: 1,
                    lat: 1,
                    active: true,
                }
            }
        )
    })
})