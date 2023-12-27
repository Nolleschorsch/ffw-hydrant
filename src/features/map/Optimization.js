import React from 'react'
import Problem from './Problem'
import SolutionSelect from './SolutionSelect'


export const Optimization = (props) => {

    return (
        <div>
            <SolutionSelect />
            <span>Neue Lösung erstellen</span>
            <Problem />
        </div>
    )

}


export default Optimization