import React from 'react'
import Stack from 'react-bootstrap/Stack'
import Problem from './components/problem'
import SolutionSelect from './components/solutionselect'


export const Optimization = (props) => {

    return (
        <Stack gap={1}>
            <SolutionSelect />
            <Problem />
        </Stack>
    )

}


export default Optimization