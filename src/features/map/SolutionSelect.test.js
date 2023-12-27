import React from 'react'
import { cleanup, screen, act } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { renderWithProviders } from '../../test-utils'
import SolutionSelect from './SolutionSelect'
import handlers from '../../mocks/handlers'
import { setToast } from './toastSlice'
import { setSolution, setSolutionName, setRoutes, setSources, setLayers } from './mapSlice'
import userEvent from '@testing-library/user-event'

jest.mock('./toastSlice', () => ({
    ...jest.requireActual('./toastSlice'),
    setToast: jest.fn(() => ({ 'type': 'mockAction' }))
}))

jest.mock('./mapSlice', () => ({
    ...jest.requireActual('./mapSlice'),
    setSolution: jest.fn(() => ({ 'type': 'mockAction' })),
    setSolutionName: jest.fn(() => ({ 'type': 'mockAction' })),
    setRoutes: jest.fn(() => ({ 'type': 'mockAction' })),
    setSources: jest.fn(() => ({ 'type': 'mockAction' })),
    setLayers: jest.fn(() => ({ 'type': 'mockAction' }))
}))

describe('SolutionSelect Component', () => {

    beforeAll(() => {
        //jest.useFakeTimers()
        server.listen()
    })

    beforeEach(() => {
    })

    afterEach(() => {
        jest.clearAllMocks()
        cleanup()
    })

    afterAll(() => {
        server.close()
        //jest.useRealTimers()
    })

    /*  it('can render', () => {
         const div = document.createElement('div')
         const { container, store } = renderWithProviders(<SolutionSelect />, {
             container: document.body.appendChild(div),
         })
         expect(container).toBeInTheDocument()
     }) */
    it('error useGetSolutionsQuery', async () => {
        //server.listHandlers
        server.resetHandlers()
        server.use(
            http.get('http://localhost/api/solution', () => {
                return HttpResponse.error()
            })
        )
        const div = document.createElement('div')
        const { container, store } = renderWithProviders(<SolutionSelect />, {
            container: document.body.appendChild(div),
        })
        expect(setToast).toHaveBeenCalledWith(
            { bg: 'warning', toastTxt: 'loading...', toastTitle: 'getSolutions', show: true }
        )

        await act(async () => {
            await new Promise(r => setTimeout(r, 3000))
        })

        expect(setToast).toHaveBeenLastCalledWith(
            { bg: 'danger', toastTxt: 'TypeError: Failed to fetch', toastTitle: 'getSolutions', show: true }
        )

    })

    /* it('error useGetSolutionsQuery 401', async () => {
        //server.listHandlers
        server.resetHandlers()
        server.use(
            http.get('http://localhost/api/solution', () => {
                return HttpResponse.json({ error: 'FUCK IT'}, {status: 401})
            })
        )
        const div = document.createElement('div')
        const { container, store } = renderWithProviders(<SolutionSelect />, {
            container: document.body.appendChild(div),
        })
        expect(setToast).toHaveBeenCalledWith(
            { bg: 'warning', toastTxt: 'loading...', toastTitle: 'getSolutions', show: true }
        )

        await act(async () => {
            await new Promise(r => setTimeout(r, 4000))
        })

        expect(setToast).toHaveBeenLastCalledWith(
            { bg: 'danger', toastTxt: 'TypeError: Failed to fetch', toastTitle: 'getSolutions', show: true }
        )

    }) */

    it('success useGetSolutionsQuery success getSolutionDetail', async () => {
        server.resetHandlers()
        server.use(
            http.get('http://localhost/api/solution', () => {
                return HttpResponse.json([{ id: 1, name: 'Foobar' }], { status: 200 })
            }),
            http.get('http://localhost/api/solution/1', () => {

                return HttpResponse.json({
                    solution: {routes: []},
                    routes: [],
                    name: 'Foobar',
                    id: 1
                }, {status: 200})
            })
        )
        const div = document.createElement('div')
        const { container, store } = renderWithProviders(<SolutionSelect />, {
            container: document.body.appendChild(div),
        })
        expect(setToast).toHaveBeenCalledWith(
            { bg: 'warning', toastTxt: 'loading...', toastTitle: 'getSolutions', show: true }
        )

        await act(async () => {
            await new Promise(r => setTimeout(r, 3000))
        })

        expect(setToast).toHaveBeenLastCalledWith({
            bg: 'success', toastTxt: 'Success', toastTitle: 'getSolutions', show: true
        })


        const selectEl = screen.getByRole('combobox')
        expect(selectEl).toBeInTheDocument()
        await userEvent.selectOptions(selectEl, 'Foobar')
        expect(setSolution).toHaveBeenCalledWith({routes: []})
        expect(setSolutionName).toHaveBeenCalledWith('Foobar')
        expect(setRoutes).toHaveBeenCalledWith([])
        expect(setSources).toHaveBeenCalled()
        expect(setLayers).toHaveBeenCalled()

    })

    it('success useGetSolutionsQuery error getSolutionDetail', async () => {
        server.resetHandlers()
        server.use(
            http.get('http://localhost/api/solution', () => {
                return HttpResponse.json([{ id: 1, name: 'Foobar' }], { status: 200 })
            }),
            http.get('http://localhost/api/solution/1', () => {

                return HttpResponse.error()
            })
        )
        const div = document.createElement('div')
        const { container, store } = renderWithProviders(<SolutionSelect />, {
            container: document.body.appendChild(div),
        })
        expect(setToast).toHaveBeenCalledWith(
            { bg: 'warning', toastTxt: 'loading...', toastTitle: 'getSolutions', show: true }
        )

        await act(async () => {
            await new Promise(r => setTimeout(r, 3000))
        })

        expect(setToast).toHaveBeenLastCalledWith({
            bg: 'success', toastTxt: 'Success', toastTitle: 'getSolutions', show: true
        })


        const selectEl = screen.getByRole('combobox')
        expect(selectEl).toBeInTheDocument()
        await userEvent.selectOptions(selectEl, 'Foobar')

        expect(setToast).toHaveBeenLastCalledWith({
            bg: 'danger', toastTxt: 'TypeError: Failed to fetch', toastTitle: 'handleSolutionSelect', show: true
        })

    })

})