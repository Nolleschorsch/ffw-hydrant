import React from 'react'
import RouteTable from './components/routetable'

export const PrintRoutes = (props) => {
    const { solution } = props

    return (
        <div>
            {solution && solution.routes
                ? solution.routes.map((route, i) =>
                    <RouteTable key={i} {...route} />
                )
                : solution && solution.message
                    ? <span>{solution.message}</span>
                    : null
            }
        </div>
    )
}


export default PrintRoutes