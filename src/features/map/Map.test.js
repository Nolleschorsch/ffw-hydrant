//jest.useFakeTimers('modern')
//import { timeout } from './utils'
//import 'whatwg-fetch'
import React from 'react'
//import '@testing-library/jest-dom';
import { screen, cleanup, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from '../../mocks/server'
import handlers from '../../mocks/handlers'
import Map from './Map'
import { renderWithProviders } from '../../test-utils'
import { http, HttpResponse } from 'msw'

const mockPerformanceMark = jest.fn();
window.performance.mark = mockPerformanceMark;

jest.mock('mapbox-gl', () => ({
    //...jest.requireActual('mapbox-gl'),
    Map: jest.fn(() => ({
        //once: jest.fn(() => Promise.resolve),
        once: jest.fn().mockReturnThis(),
        addLayer: jest.fn().mockReturnThis(),
        removeLayer: jest.fn().mockReturnThis(),
        addSource: jest.fn(),
        removeSource: jest.fn().mockReturnThis(),
        addControl: jest.fn(),
        removeControl: jest.fn(),
        getLayer: jest.fn(),
        getSource: jest.fn(),
        setTerrain: jest.fn(),
        setLayoutProperty: jest.fn(),
        //on: jest.fn(),
        //on: jest.fn((eventType, fn) => fn()),
        on: jest.fn(),
        off: jest.fn(),
        resize: jest.fn()
    })),
    Marker: jest.fn(() => ({
        setLngLat: jest.fn().mockReturnThis(),
        setPopup: jest.fn().mockReturnThis(),
        addTo: jest.fn().mockReturnThis(),
        on: jest.fn().mockReturnThis(),
        remove: jest.fn()
    })),
    Popup: jest.fn(() => ({
        setDOMContent: jest.fn().mockReturnThis()
    }))
}))

describe('Map Component', () => {

    beforeAll(() => {
        server.listen()
    })

    it('can render', async () => {
        server.use(...handlers.drf_handlers)
        const div = document.createElement('div')
        const { container, store } = renderWithProviders(<Map />, {
            container: document.body.appendChild(div),
        })
        await act(async () => {
            await new Promise(r => setTimeout(r, 3000))
        })
        
    })

    afterEach(() => {
        cleanup()
        server.resetHandlers()
    })

    afterAll(() => {
        server.close()
    })

})