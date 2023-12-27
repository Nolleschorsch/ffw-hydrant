import React from 'react'
import { act, cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test-utils'
import RouteList, { createSolutionInfo, toggleAll } from './RouteList'
import solution from '../../mocks/data/solution/solutionCompleteWithHome2.json'
import routes from '../../mocks/data/routes/routes.json'
import { setSolution, setRoutes } from './mapSlice'

jest.mock('./utils', () => {
    const originalModule = jest.requireActual('./utils');

    return {
        __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        getStartEndDates: jest.fn().mockReturnValue([0, 0]),
        getTimeDeltaMinutes: jest.fn().mockReturnValue(0)
    };
})

describe('RouteList utils', () => {
    it('toggleAll true', () => {
        const routes = [
            { name: 'foo' },
            { name: 'bar' }
        ]
        const cb = jest.fn()
        toggleAll(routes, cb, true)
        expect(cb).toHaveBeenCalledTimes(6)
        expect(cb).toHaveBeenCalledWith('routeLayer-foo', true)
        expect(cb).toHaveBeenCalledWith('hydrantLayer-foo', true)
        expect(cb).toHaveBeenCalledWith('symbolLayer-foo', true)
        expect(cb).toHaveBeenCalledWith('routeLayer-bar', true)
        expect(cb).toHaveBeenCalledWith('hydrantLayer-bar', true)
        expect(cb).toHaveBeenCalledWith('symbolLayer-bar', true)

    })
    it('toggleAll false', () => {
        const routes = [
            { name: 'foo' },
            { name: 'bar' }
        ]
        const cb = jest.fn()
        toggleAll(routes, cb, false)
        expect(cb).toHaveBeenCalledTimes(6)
        expect(cb).toHaveBeenCalledWith('routeLayer-foo', false)
        expect(cb).toHaveBeenCalledWith('hydrantLayer-foo', false)
        expect(cb).toHaveBeenCalledWith('symbolLayer-foo', false)
        expect(cb).toHaveBeenCalledWith('routeLayer-bar', false)
        expect(cb).toHaveBeenCalledWith('hydrantLayer-bar', false)
        expect(cb).toHaveBeenCalledWith('symbolLayer-bar', false)

    })
    it('createSolutionInfo', () => {
        const sortedSolutionRoutes = [
            {
                stops: [
                    { odometer: 0 },
                    { odometer: 250 },
                    { odometer: 500 }
                ]
            },
            {
                stops: [
                    { odometer: 100 },
                    { odometer: 300 },
                    { odometer: 500 }
                ]
            }
        ]
        const expected = '0min 1000m 2 Hydranten'
        const result = createSolutionInfo(sortedSolutionRoutes)
        expect(result).toEqual(expected)
    })
})

describe('RouteList Component', () => {

    afterEach(() => {
        cleanup()
    })

    it('can render', () => {
        const div = document.createElement('div')

        const { container } = renderWithProviders(<RouteList />, {
            container: document.body.appendChild(div),
        });

        expect(container).toBeInTheDocument()
    })
    it('', async () => {
        const setLayerVisibility = jest.fn()
        const div = document.createElement('div')
        const preloadedState = {
            mapbox: {
                solution: {
                    routes: []
                },
                solutionName: 'Foobar',
                routes: []
            }
        }
        const { container, store } = renderWithProviders(
            <RouteList setLayerVisibility={setLayerVisibility} />, {
            preloadedState,
            container: document.body.appendChild(div),
        });
        expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Foobar')
        expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent(
            '0min 0m 0 Hydranten'
        )
        act(() => {
            store.dispatch(setSolution(solution))
            store.dispatch(setRoutes(routes))
        })
        expect(await screen.findByText('0min 20118m 123 Hydranten')).toBeInTheDocument()
        expect(await screen.findAllByRole('heading', { level: 6 })).toHaveLength(8)


        const showBtn = screen.getByRole('button', { name: 'Alle anzeigen' })
        const hideBtn = screen.getByRole('button', { name: 'Alle verbergen' })
        await userEvent.click(showBtn)
        await userEvent.click(hideBtn)


    })
})