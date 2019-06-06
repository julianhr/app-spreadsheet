import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'emotion-theming'
import { Global } from '@emotion/core'
import 'sanitize.css'

import appStore from './reducers/'
import globalStyles from './styles/globalStyles'
import theme from './styles/theme'
import App from './App'


function Root() {
  return (
    <Provider store={appStore}>
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
