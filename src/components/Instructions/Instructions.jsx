import React from 'react'
import styled from '@emotion/styled'
import FunctionList from './FunctionList'
import SourceCode from './SourceCode'


const Root = styled.div`
  display: flex;
  padding: 40px;
  justify-content: space-evenly;
`

function Instructions() {
  return (
    <Root>
      <FunctionList />
      <SourceCode />
    </Root>
  )
}

export default Instructions
