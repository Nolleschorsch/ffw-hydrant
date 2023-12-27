import React from 'react'
import RouteTable from './RouteTable'

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