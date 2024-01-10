import React from 'react'
import { screen, cleanup, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from '../../mocks/server'
import handlers from '../../mocks/handlers'
import HydrantList, { getFilteredHydrants } from './HydrantList'
import { renderWithProviders } from '../../test-utils'
import { http, HttpResponse } from 'msw'
import { setHydrants } from './mapSlice'


describe('getFilteredHydrants', () => {

    const hydrants = [
        { name: 'foo', lat: 1, lng: 1, id: 1 },
        { name: 'bar', lat: 2, lng: 2, id: 2 },
        { name: 'baz', lat: 3, lng: 3, id: 3 }
    ]


    it.each([
        { filter: '', expected: [...hydrants] },
        { filter: 'ba', expected: [...hydrants.slice(1)] },
        { filter: 'baz', expected: [...hydrants.slice(2)] },
        { filter: '2', expected: [...hydrants.slice(1, 2)] }
    ])('returns expected value for filter %s', ({ filter, expected }) => {
        expect(getFilteredHydrants(hydrants, filter)).toEqual(expected)
        //console.log({filter, expected})
    })

})


describe('HydrantList', () => {

    beforeAll(() => {
        server.listen()
        //jest.useFakeTimers()
    })

    afterEach(() => {
        server.resetHandlers()
        cleanup()
        //jest.runOnlyPendingTimers()
    })

    afterAll(() => {
        server.close()
        //jest.useRealTimers()
    })

    it('can render', async () => {

        server.use(...handlers.drf_handlers)
        const div = document.createElement('div')
        const markers = []

        const { container } = renderWithProviders(<HydrantList markers={markers} />, {
            container: document.body.appendChild(div),
        });


        expect(container).toBeInTheDocument()


        const searchInput = await screen.findByPlaceholderText('Suche')
        expect(searchInput).toBeTruthy()
        const hydrantStack = await screen.findByTestId('hydrant-stack')
        expect(hydrantStack).toBeTruthy()
        const hydrantComponent = await screen.findAllByTestId('hydrant-component')
        expect(hydrantComponent).toHaveLength(122)
        const txt = '122 Hydranten | 0 ungespeicherte Änderungen'
        const statusText = await screen.findByText(txt)
        expect(statusText).toBeTruthy()

    })

    it('Button click Speichern', async () => {
        server.use(...handlers.drf_handlers)

        //server.use(http.post('http://localhost/api/hydrant', () => HttpResponse.json({ message: 'Speichern Erfolgreich!' }, { status: 202 })))

        const div = document.createElement('div')
        const markers = []
        const preloadedState = {
            mapbox: {
                hydrants:
                    [{ lat: 1, lng: 1, name: 'foo', active: true }]
            }
        }

        const { container, store } = renderWithProviders(<HydrantList markers={markers} />, {
            container: document.body.appendChild(div),
            preloadedState
        })

        await waitFor(() => {
            expect(container).toBeInTheDocument()
        })

        const saveBtn = await screen.findByRole('button', { name: 'Speichern' })
        //jest.runAllTimers()
        await act(async () => {
            await userEvent.click(saveBtn, { delay: null })
        })

    })

    it('Button click Speichern Fehler', async () => {
        server.use(
            http.get('http://localhost/api/hydrant', () => {
                return HttpResponse.json(hydrants)
            }),
            http.post('http://localhost/api/hydrant', (req, res, ctx) => {
                return HttpResponse.json({ error: 'Speichern fehlgeschlagen!' }, { status: 500 })
            })
        )

        //server.use(http.post('http://localhost/api/hydrant', () => HttpResponse.json({ message: 'Speichern Erfolgreich!' }, { status: 202 })))

        const div = document.createElement('div')
        const markers = []

        const { container, store } = renderWithProviders(<HydrantList markers={markers} />, {
            container: document.body.appendChild(div),
        })
        expect(container).toBeInTheDocument()
        /* await waitFor(() => {
            expect(container).toBeInTheDocument()
        }) */

        const saveBtn = await screen.findByRole('button', { name: 'Speichern' })
        //jest.runAllTimers()
        await act(async () => {
            await userEvent.click(saveBtn, { delay: null })
        })

    })

    it('Enter Filter', async () => {
        server.use(...handlers.drf_handlers)
        const div = document.createElement('div')
        const markers = []

        const { container } = renderWithProviders(<HydrantList markers={markers} />, {
            container: document.body.appendChild(div),
        });

        expect(container).toBeInTheDocument()

        const hydrants = await screen.findAllByTestId('hydrant-component')
        expect(hydrants).toHaveLength(122)

        const searchInput = await screen.findByPlaceholderText('Suche')
        await act(async () => {
            await userEvent.type(searchInput, 'Emil-Nolde', { delay: null })
        })

        const hydrantsFiltered = await screen.findAllByTestId('hydrant-component')
        expect(hydrantsFiltered).toHaveLength(1)
        await act(async () => {
            await userEvent.clear(searchInput)
        })
        expect(await screen.findAllByTestId('hydrant-component')).toHaveLength(122)

    }, 15000)

})