/* @jsx jsx */
import { jsx, css } from '@emotion/core'

import theme from './theme'


const globalStyles = css`
  body {
    color: ${theme.colors.text};
    line-height: 1.3em;
    font-family: Arial, Helvetica, sans-serif;
  }

  table, th, td {
    border: 0;
    border-spacing: 0;
    border-collapse: collapse;
  }

  td {
    padding: 0;
    line-height: 1.2em;
  }

  pre, p, h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }

  ul, li {
    margin: 0;
    padding: 0;
  }
`

export default globalStyles
