import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'emotion-theming'
import { Global } from '@emotion/core'
import 'sanitize.css'

import appStoreFn from './reducers/'
import globalStyles from './styles/globalStyles'
import theme from './styles/theme'
import App from './App'


const APP_STORE = appStoreFn()


function Root() {
  return (
    <Provider store={APP_STORE}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Global styles={globalStyles} />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  )
}

export default Root