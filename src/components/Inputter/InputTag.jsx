/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core' // eslint-disable-line


export const Input = styled.input`
  height: 100%;
  outline: none;
  width: 100%;
  z-index: 100;
`

function InputTag({ fwdRef, value, style, props, onChange, onKeyUp }) {
  return (
    <Input
      ref={fwdRef}
      css={style}
      value={value}
      onChange={onChange}
      onKeyUp={onKeyUp}
      {...props}
    />
  )
}

InputTag.propTypes = {
  fwdRef: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func.isRequired,
  props: PropTypes.object,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  value: PropTypes.string.isRequired,
}

InputTag.defaultProps = {
  style: {},
  props: {},
}

export default InputTag
