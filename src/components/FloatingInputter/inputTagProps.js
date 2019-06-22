
/* @jsx jsx */
import React from 'react' // eslint-disable-line
import { jsx, css } from '@emotion/core'


const style = props => css`
  align-items: center;
  background-color: white;
  border: 2px solid salmon;
  box-shadow: 0 0 5px ${props.colors.shadow};
  box-sizing: border-box;
  display: flex;
  font-size: 13px;
  padding: 0 8px 0 2px;
`
const props = {
  'data-inputter': 'floating',
}

export default { style, props }
