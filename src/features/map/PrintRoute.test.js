import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import PrintRoutes from './PrintRoute'


describe('PrintRoutes Component', () => {

    afterEach(() => {
        cleanup()
    })

    it('can render', () => {
        const { container } = render(<PrintRoutes />)
        expect(container).toBeInTheDocument()
    })
    it('can render with solution.routes', () => {
        const solution = {
            routes: [
                {}, {}
            ]
        }
        const { container } = render(<PrintRoutes solution={solution} />)
        expect(container).toBeInTheDocument()
        expect(screen.getAllByTestId('route-table')).toHaveLength(2)
    })
    it('can render with solution.message', () => {
        const solution = {
            message: 'Foobar'
        }
        const { container } = render(<PrintRoutes solution={solution} />)
        expect(container).toBeInTheDocument()
        expect(screen.getByText('Foobar')).toBeInTheDocument()
    })
})