import React from 'react'
import styled from '@emotion/styled'


const Root = styled.header`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const Name = styled.a`
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  padding: 10px 0 0;

  :hover {
    text-decoration: underline;
  }
`

const Title = styled.h3`
  align-self: center;
  padding: 10px 0 20px;
`

function Header() {
  return (
    <Root>
      <Name
        href='https://www.cimarron.me'
        rel='noopener noreferrer'
      >
        Julian Hernandez
      </Name>
      <Title>Spreadsheet App</Title>
    </Root>
  )
}

export default Header
