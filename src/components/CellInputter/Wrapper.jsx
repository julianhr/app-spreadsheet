/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core' // eslint-disable-line


const Root = styled.div`
  position: fixed;
`

function Wrapper({ top, left, width, height, children }) {
  return (
    <Root
      css={{ top, left, width, height }}
    >
      {children}
    </Root>
  )
}

Wrapper.propTypes = {
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

export default Wrapper
