/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core' // eslint-disable-line


export const Input = styled.input`
  align-items: center;
  background-color: white;
  border: 2px solid salmon;
  box-shadow: 0 0 5px ${props => props.theme.colors.shadow};
  box-sizing: border-box;
  display: flex;
  font-size: 13px;
  height: 100%;
  outline: none;
  padding: 0 8px 0 2px;
  width: 100%;
`

function InputTag({ fwdRef, location, value, style, onChange, onKeyDown }) {
  return (
    <Input
      ref={fwdRef}
      data-cell='input'
      data-location={location}
      css={style}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  )
}

InputTag.propTypes = {
  fwdRef: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  style: PropTypes.object,
}

InputTag.defaultProps = {
  style: {},
}

export default InputTag
