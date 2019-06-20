import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'


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
  padding: 2px;
  width: 100%;
`

function InputTag({ fwdRef, location, value, onChange, onKeyDown, onBlur }) {
  return (
    <Input
      ref={fwdRef}
      data-cell='input'
      data-location={location}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    />
  )
}

InputTag.propTypes = {
  fwdRef: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  OnChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
}

export default InputTag
