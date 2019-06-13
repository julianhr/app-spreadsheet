/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import { jsx, css } from '@emotion/core' // eslint-disable-line
import styled from '@emotion/styled'


const NoOp = () => {}

const Li = styled.li`
  outline: none;
`

function DropdownItem({ item, index, isActive, onMouseEnter }) {
  return (
    <Li
      tabIndex={0}
      onMouseEnter={() => onMouseEnter(index)}
    >
      {isActive && item.active ? item.active : item.base}
    </Li>
  )
}

DropdownItem.propTypes = {
  item: PropTypes.shape({
    base: PropTypes.node.isRequired,
    active: PropTypes.node,
  }),
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func,
}

DropdownItem.defaultProps = {
  onMouseEnter: NoOp,
}

export default DropdownItem
