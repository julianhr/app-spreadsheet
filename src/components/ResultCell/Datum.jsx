/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core' // eslint-disable-line


const Root = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid transparent;
  line-height: 1.1em;
  height: 100%;
  width: 100%;
  padding: 2px;
`

function Datum({
  fwdRef,
  isActive,
  location,
  onClick,
  onDoubleClick,
  onFocus,
  onKeyDown,
  result,
}) {

  const getStyle = () => {
    let style = {}

    if (typeof result === 'number') {
      style = {
        whiteSpace: 'nowrap',
        textOverflow: 'clip',
        overflow: 'hidden',
      }
    }

    if (isActive) {
      style.border = '2px solid salmon'
    }

    return style
  }

  return (
    <Root
      ref={fwdRef}
      data-cell='result'
      data-location={location}
      css={getStyle()}
      tabIndex='0'
      onClick={onClick}
      onKeyDown={onKeyDown}
      onDoubleClick={onDoubleClick}
      onFocus={onFocus}
    >
    {result}
  </Root>
  )
}

Datum.propTypes = {
  fwdRef: PropTypes.object.isRequired,
  result: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
}

export default Datum
