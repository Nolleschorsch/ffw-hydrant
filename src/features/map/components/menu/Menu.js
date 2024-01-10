import React, { useState } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Optimization from './components/optimization'
import RouteList from './components/routelist'
import HydrantList from './components/hydrantlist'
import ToastService from './components/toastservice'


export const getLayers = (key, layers) => {
    let visibleLayers
    let invisibleLayers
    if (key === 'hydrants') {
        visibleLayers = ['unclustered-point', 'clusters', 'cluster-count']
        invisibleLayers = layers
    } else {
        visibleLayers = layers
        invisibleLayers = ['unclustered-point', 'clusters', 'cluster-count']
    }
    return { visibleLayers, invisibleLayers }
}

export const Menu = (props) => {

    const { setLayerVisibility, getLayerVisibility, routes, layers } = props
    const [key, setKey] = useState('optimization')


    const handleSelect = key => {
        setKey(key)

        const { visibleLayers, invisibleLayers } = getLayers(key, layers.map(x => x.id))
        for (const layer of visibleLayers) {
            setLayerVisibility(layer, true)
        }
        for (const layer of invisibleLayers) {
            setLayerVisibility(layer, false)
        }

        /* const visible = key === 'optimization' ? false : true

        setLayerVisibility('unclustered-point', visible)
        setLayerVisibility('clusters', visible)
        setLayerVisibility('cluster-count', visible) */

    }

    return (
        <div >
            <Tabs
                id="menu"
                activeKey={key}
                onSelect={handleSelect}
                className="mb-3"
                variant="underline"
            >
                <Tab eventKey="hydrants" title="Hydranten bearbeiten">
                    <HydrantList />
                </Tab>
                <Tab eventKey="optimization" title="Pläne bearbeiten">
                    <Optimization />
                    <RouteList setLayerVisibility={setLayerVisibility} getLayerVisibility={getLayerVisibility} />
                </Tab>
            </Tabs>
            <ToastService />
        </div>
    )

}


export default Menu