/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core' // eslint-disable-line
import { connect } from 'react-redux'

import { DEFAULT_COL_WIDTH } from '~/library/constants'


const Root = styled.div`
  cursor: cell;
  overflow: hidden;
  font-size: 13px;
  border-right: 1px solid ${props => props.theme.colors.table.border};
  border-bottom: 1px solid ${props => props.theme.colors.table.border};
  outline: none;
`

export function OutterBorder({ width, height, onClick, onDoubleClick, children }) {
  return (
    <Root
      data-cell='border'
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      css={{
        width,
        height: height && height
      }}
    >
      {children}
    </Root>
  )
}

OutterBorder.propTypes = {
  onClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
}

OutterBorder.defaultProps = {
  width: DEFAULT_COL_WIDTH,
}

function mapStateToProps(state, ownProps) {
  const [colLabel, rowLabel] = ownProps.location.split('-')
  const width = state.tableMeta.colWidths[colLabel]
  const height = state.tableMeta.rowHeights[rowLabel]
  return { width, height }
}

export default connect(mapStateToProps)(OutterBorder)
