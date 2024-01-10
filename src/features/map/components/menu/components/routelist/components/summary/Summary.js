import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { Clock, RocketTakeoff } from 'react-bootstrap-icons'
import { getTimeDeltaMinutes, getStartEndDates, compareRouteStopsByOdometer } from './index'
import PersonWalking from './PersonWalking'


export const Summary = ({ totalTime, totalDistance, totalHydrants }) => {

    //const { totalTime, totalDistance, totalHydrants } = createSolutionInfo(sortedSolutionRoutes)

    return (
        <ListGroup >
            <ListGroup.Item><Clock className='me-3' />{totalTime} min</ListGroup.Item>
            <ListGroup.Item><PersonWalking />{totalDistance}m</ListGroup.Item>
            <ListGroup.Item><RocketTakeoff className='me-3' />{totalHydrants} Hydranten</ListGroup.Item>
        </ListGroup>
    )

}


export default Summary