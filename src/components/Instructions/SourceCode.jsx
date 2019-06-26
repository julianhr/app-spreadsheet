import React from 'react'
import styled from '@emotion/styled'

import srcGithubLogo from '~/assets/github_logo.png'


const Root = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
`

const Img = styled.img`
  width: 52px;
  margin-top: -4px;
`

function SourceCode() {
  return (
    <Root>
      Source code on 
      <a
        href='https://github.com/julianhr/app-spreadsheet'
        rel='noopener noreferrer'
        target='_blank'
      >
        <Img
          src={srcGithubLogo}
          alt='GitHub source code'
        />
      </a>
    </Root>
  )
}

export default SourceCode
