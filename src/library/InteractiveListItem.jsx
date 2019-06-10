/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import { jsx, css } from '@emotion/core' // eslint-disable-line
import styled from '@emotion/styled'


const Li = styled.li`
`

function DropdownItem({ item, isActive }) {
  return (
    <Li
      tabIndex={0}
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
  isActive: PropTypes.bool.isRequired,
}

export default DropdownItem
