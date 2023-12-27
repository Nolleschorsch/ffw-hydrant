import React, { useState } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Optimization from './Optimization'
import RouteList from './RouteList'
import HydrantList from './HydrantList'
import ToastService from './ToastService'

export const Menu = (props) => {

    const { setLayerVisibility, routes } = props
    const [key, setKey] = useState('hydranten')

    const handleSelect = key => {
        setKey(key)

        const visible = key === 'optimization' ? false : true

        setLayerVisibility('unclustered-point', visible)
        setLayerVisibility('clusters', visible)
        setLayerVisibility('cluster-count', visible)

    }

    return (
        <div >
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={handleSelect}
                //onSelect={(k) => setKey(k)}
                className="mb-3"
            >
                <Tab eventKey="optimization" title="Pläne bearbeiten">
                    <Optimization />
                    <RouteList setLayerVisibility={setLayerVisibility} />
                </Tab>
                <Tab eventKey="hydranten" title="Hydranten bearbeiten">
                    <HydrantList />
                </Tab>
            </Tabs>
            <ToastService />
        </div>
    )

}


export default Menu