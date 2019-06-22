/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core' // eslint-disable-line


export const Input = styled.input`
  height: 100%;
  outline: none;
  width: 100%;
`

function InputTag({ fwdRef, value, style, props, onChange, onKeyDown }) {
  return (
    <Input
      ref={fwdRef}
      css={style}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      {...props}
    />
  )
}

InputTag.propTypes = {
  fwdRef: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  props: PropTypes.object,
}

InputTag.defaultProps = {
  style: {},
  props: {},
}

export default InputTag
