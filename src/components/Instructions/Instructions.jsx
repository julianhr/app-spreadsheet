import React from 'react'
// import PropTypes from 'prop-types'
import styled from '@emotion/styled'


const Root = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
`

const Wrapper = styled.div`
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

function Instructions() {
  return (
    <Root>
      <Wrapper>
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
      </Wrapper>
    </Root>
  )
}

export default Instructions
