import React from 'react'
import { screen, cleanup, act, waitForElementToBeRemoved } from '@testing-library/react'
import { renderWithProviders } from '../../test-utils'
import ToastService from './ToastService'
import { setToast } from './toastSlice'

describe('ToastService Component', () => {

    beforeAll(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        cleanup()
    })

    afterAll(() => {
        jest.useRealTimers()
    })

    it('can render', () => {
        const div = document.createElement('div')

        const { container } = renderWithProviders(<ToastService />, {
            container: document.body.appendChild(div)
        })

        expect(container).toBeInTheDocument()

    })

    it('can show toast, which is shown for 5 seconds', async () => {
        const div = document.createElement('div')

        const { container, store } = renderWithProviders(<ToastService />, {
            container: document.body.appendChild(div)
        })

        const toastContainer = await screen.findByTestId('toast-container')
        expect(toastContainer).toBeInTheDocument()
        const toastBefore = screen.queryByTestId('toast')
        expect(toastBefore).not.toBeInTheDocument()
        const toastObj = {
            show: true,
            toastTitle: 'Foo Title',
            toastTxt: 'Bar Text',
            bg: 'primary'
        }
        await act(() => store.dispatch(setToast(toastObj)))
        const toastAfter = await screen.findByTestId('toast')
        expect(toastAfter).toBeVisible()
        expect(await screen.findByText('Foo Title')).toBeVisible()
        expect(await screen.findByText('Bar Text')).toBeVisible()
        await waitForElementToBeRemoved(toastAfter, {timeout: 6000})
        expect(screen.queryByTestId('toast')).not.toBeInTheDocument()
    })

})