import React from 'react'
import Table from 'react-bootstrap/Table'
import { getTimeDeltaMinutes, getStartEndDates } from './utils'


export const RouteTable = (props) => {

    const { stops = [], vehicle } = props
    const lastStop = stops.slice(-1)[0]

    const distance = (lastStop && lastStop.odometer) || 0

    const [start, end] = getStartEndDates(stops)
    const deltaTimeMinutes = getTimeDeltaMinutes({start, end})

    return (
        <>
            <Table bordered size="sm" data-testid='route-table'>
                <thead>
                    <tr>
                        <th colSpan="19" scope="col"><h5>{vehicle} ({stops.length} Hydranten)</h5>
                            <span>Distanz: {distance}m | Dauer: {deltaTimeMinutes} Minuten</span>
                        </th>
                    </tr>
                    <tr>
                        <th colSpan="2"></th>
                        <th colSpan="6" scope="col">Hinweisschild</th>
                        <th colSpan="4" scope="col">Straßenkappe</th>
                        <th colSpan="7" scope="col">Innenfunktion</th>
                    </tr>
                    <tr>
                        <th>#</th>
                        <th>OK</th>
                        {/* Hinweisschild */}
                        <th>fehlt</th>
                        <th>verdeckt</th>
                        <th>verdreckt</th>
                        <th>unvollständig</th>
                        <th>Befestigung</th>
                        <th>Maße falsch</th>
                        {/* Straßenkappe */}
                        <th>defekt</th>
                        <th>nicht öffnenbar</th>
                        <th>Steg Hydr.-Schlüssel fehlt</th>
                        <th>Haltestift fehlt / defekt</th>
                        {/* Innenfunktion */}
                        <th>Deckel fehlt</th>
                        <th>Kette abgerissen</th>
                        <th>Klaue defekt</th>
                        <th>nicht/schwer drehbar</th>
                        <th>Hydrant undicht</th>
                        <th>keine Entwässerung</th>
                        <th>verschlammt</th>
                    </tr>
                </thead>
                <tbody>
                    {stops && stops.map((stop, i) => {

                        const tds = Array(19).fill(undefined).map((x, j) => {
                            const key = `stop${i}-td${j}`
                            return j === 0 ? <td key={key}>{stop.location}</td> : <td key={key}></td>
                        })
                        return (
                            <tr key={i}>{tds}</tr>
                        )
                    })}
                </tbody>
            </Table>
            <div className="pagebreak"> </div>
        </>
    )
}


export default RouteTable