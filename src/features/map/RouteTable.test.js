import React from 'react'
import { screen, render, cleanup } from '@testing-library/react'
import RouteTable from './RouteTable'
import { getTimeDeltaMinutes, getStartEndDates } from './utils'

jest.mock('./utils', () => {
    const originalModule = jest.requireActual('./utils');

    return {
        __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        getStartEndDates: jest.fn().mockReturnValue([0, 0]),
        getTimeDeltaMinutes: jest.fn().mockReturnValue(0)
    };
})

describe('RouteTable Component', () => {

    it('can render', () => {
        const { container } = render(<RouteTable />)
        expect(container).toBeInTheDocument()
    })
    it('', () => {

        const props = {
            stops: [1, 2],
            vehicle: 'foo'
        }
        render(<RouteTable {...props} />)
        expect(getStartEndDates).toHaveBeenCalledWith([1,2])
        expect(getTimeDeltaMinutes).toHaveBeenCalledWith({start: 0, end: 0})
    })
})