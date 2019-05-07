import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'


const Root = styled.header`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0 30px;
`

function Header() {
  return (
    <Root>
      <h3>Spreadsheet App</h3>
    </Root>
  )
}

export default Header
