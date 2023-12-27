import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Route from './Route'


describe('Route Component', () => {
    afterEach(() => {
        cleanup()
    })
    it('can render', () => {
        const { container } = render(<Route />)
        expect(container).toBeInTheDocument()
    })
    it('show hide route layers', async () => {
        const setLayerVisibility = jest.fn()
        const props = {
            index: 0,
            name: 'Foobar',
            setLayerVisibility,
            solutionRouteStops: [
                {type: 'service', location: 'location1'}
            ]
        }
        const { container } = render(<Route {...props} />)
        const showBtn = screen.getByRole('button', {name: 'Anzeigen'})
        const hideBtn = screen.getByRole('button', {name: 'Verbergen'})
        const infoBtn = screen.getByTestId('route-info-btn')

        expect(screen.getByTestId('icon-eye')).toBeInTheDocument()

        await userEvent.click(showBtn)
        await userEvent.click(hideBtn)

        await userEvent.click(infoBtn)
        expect(screen.getByTestId('icon-eye-slash')).toBeInTheDocument()

    })
})