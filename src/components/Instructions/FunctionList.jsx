import React from 'react'
import styled from '@emotion/styled'


const Root = styled.div`
  width: 400px;
  padding-left: 60px;
`

const Title = styled.h3`
  padding-bottom: 15px;
`

const Ul = styled.ul`
  list-style: none;
  column-count: 3;
`

const Li = styled.li`
  font-size: 14px;
`

function FunctionList() {
  return (
    <Root>
      <Title>Available Functions</Title>
      <Ul>
        <Li>AVERAGE</Li>
        <Li>AVG</Li>
        <Li>CONCAT</Li>
        <Li>COUNT</Li>
        <Li>MAX</Li>
        <Li>MIN</Li>
        <Li>POW</Li>
        <Li>POWER</Li>
        <Li>SQRT</Li>
        <Li>SUM</Li>
      </Ul>
    </Root>
  )
}

export default FunctionList
