import React from 'react'
import { screen, cleanup, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { renderWithProviders } from '../../test-utils'
import Problem from './Problem'
import { setLayers, setRoutes, setSolution, setSources } from './mapSlice'
import { setToast } from './toastSlice'
import handlers from '../../mocks/handlers'

jest.mock('./toastSlice', () => ({
    __esModule: true,
    ...jest.requireActual('./toastSlice'),
    setToast: jest.fn(() => ({type: 'mockAction'}))
}))

jest.mock('./mapSlice', () => ({
    __esModule: true,
    ...jest.requireActual('./mapSlice'),
    setLayers: jest.fn(() => ({type: 'mockAction'})),
    setRoutes: jest.fn(() => ({type: 'mockAction'})),
    setSolution: jest.fn(() => ({type: 'mockAction'})),
    setRoutes: jest.fn(() => ({type: 'mockAction'}))
}))

describe('Problem Component', () => {

    beforeAll(() => {
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
    })

    it('can render', () => {

        const div = document.createElement('div')
        const { container, store } = renderWithProviders(<Problem />, {
            container: document.body.appendChild(div),
        })
        expect(container).toBeInTheDocument()
    })

    it('Open and Close Modal', async () => {
        const div = document.createElement('div')
        const { container, store } = renderWithProviders(<Problem />, {
            container: document.body.appendChild(div),
        })

        const openBtn = screen.getByRole('button', {name: 'Neue Lösung'})

        const modalBefore = screen.queryByTestId('problem-modal')
        expect(modalBefore).toEqual(null)

        await userEvent.click(openBtn)

        const modalAfter = screen.queryByTestId('problem-modal')
        const closeBtn = screen.getByRole('button', {name: 'Abbrechen'})
        expect(modalAfter).toBeVisible()

        await userEvent.click(closeBtn)

        const modalClosed = screen.queryByTestId('problem-modal')
        expect(modalClosed).toEqual(null)

        await userEvent.click(openBtn)
        const closeIcon = screen.getByRole('button', { name: 'Close' })
        await userEvent.click(closeIcon)
        const modalClosed2 = screen.queryByTestId('problem-modal')
        expect(modalClosed2).toEqual(null)
    })

    it('Open Modal and change inputs', async () => {
        const div = document.createElement('div')
        const { container, store } = renderWithProviders(<Problem />, {
            container: document.body.appendChild(div),
        })
        const openBtn = screen.getByRole('button', {name: 'Neue Lösung'})
        await userEvent.click(openBtn)

        const vehicleInput = screen.getByPlaceholderText('Gruppenanzahl eintragen')
        const nameInput = screen.getByPlaceholderText('Namen eintragen')
        const durationInput = screen.getByPlaceholderText('Zeit pro Hydrant in sec')
        expect(vehicleInput).toBeInTheDocument()
        expect(nameInput).toBeInTheDocument()
        expect(durationInput).toBeInTheDocument()

        await act(async () => {
            await userEvent.type(vehicleInput, '2')
            await userEvent.type(nameInput, 'foobar')
            await userEvent.clear(durationInput)
            await userEvent.type(durationInput, '300')
        })

        expect(screen.getByPlaceholderText('Gruppenanzahl eintragen')).toHaveValue(2)
        expect(screen.getByPlaceholderText('Namen eintragen')).toHaveValue('foobar')
        expect(screen.getByPlaceholderText('Zeit pro Hydrant in sec')).toHaveValue(300)
    })
    it('Open Modal, enter inputs, submit success', async () => {
        server.use(...handlers.all_handlers)
        const div = document.createElement('div')
        const { container, store } = renderWithProviders(<Problem />, {
            container: document.body.appendChild(div),
        })
        const openBtn = screen.getByRole('button', {name: 'Neue Lösung'})
        await userEvent.click(openBtn)

        const vehicleInput = screen.getByPlaceholderText('Gruppenanzahl eintragen')
        const nameInput = screen.getByPlaceholderText('Namen eintragen')
        const durationInput = screen.getByPlaceholderText('Zeit pro Hydrant in sec')

        await act(async () => {
            await userEvent.type(vehicleInput, '2')
            await userEvent.type(nameInput, 'foobar')
            await userEvent.click(screen.getByRole('button', {name: 'Lösung anfordern'}))
        })

        expect(setToast).toHaveBeenCalledWith({
            bg: 'warning',
            toastTitle: 'getSolutionStatus',
            toastTxt: 'solution for 123e4567-e89b-12d3-a456-426655440000 pending...',
            show: true
        })

        await act(async () => {
            await new Promise(r => setTimeout(r, 6000))
        })

        expect(setToast).toHaveBeenLastCalledWith({
            bg: 'success',
            toastTitle: 'handleSubmit',
            toastTxt: 'solution for 123e4567-e89b-12d3-a456-426655440000 complete',
            show: true
        })

    }, 15000)

})
