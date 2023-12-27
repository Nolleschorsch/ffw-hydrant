import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'
import store from './app/store'
import App from './app/App'


async function enableMocking() {
    console.log('THE NODE_ENV ', process.env.NODE_ENV)
    console.log('MY_ENV_VAR', process.env.MY_ENV_VAR)
    // TODO: rename MY_ENV_VAR and change value to something meaningful
    /* if (process.env.NODE_ENV !== 'development' || process.env.MY_ENV_VAR === 'Foo') {
        return
    } */

    //const { worker } = await import('./features/map/mocks/browser')
    const { worker } = await import('./mocks/browser')

    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and ready to intercept requests.
    // TODO: use flag so this still works in dev
    return worker.start({ onUnhandledRequest: "bypass", serviceWorker: { url: './mockServiceWorker.js' } })
}

const container = document.getElementById('root')
const root = createRoot(container)

enableMocking().then(() => {
    root.render(<Provider store={store}><App /></Provider>)
})

//root.render(<Provider store={store}><App /></Provider>)