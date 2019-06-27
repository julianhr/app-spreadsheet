/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core'

import ColHeader from '../cell/ColHeader'
import { ROW_HEADER_WIDTH } from '../cell/RowHeader'


const Row = styled.div`
  display: flex;
  width: fit-content;
  position: sticky;
  top: 0;
`

const InnerBorder = styled.div`
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${props => props.theme.colors.table.borderDark};
  border-bottom: 1px solid ${props => props.theme.colors.table.borderDark};
  background: ${props => props.theme.colors.table.labelBkg};
`

function ColHeaderRow({ colLabels }) {
  const renderCornerCell = () => (
    <InnerBorder
      css={css`
        width: ${ROW_HEADER_WIDTH}px;
        height: 26px;
      `}
    />
  )

  const renderLabelCells = () => (
    new Array(colLabels.length).fill(0).map((_, i) => (
      <ColHeader
        key={i}
        label={colLabels[i]}
      />
    )
  ))

  return (
    <Row
      data-row='header'
    >
      {renderCornerCell()}
      {renderLabelCells()}
    </Row>
  )
}

ColHeaderRow.propTypes = {
  colLabels: PropTypes.arrayOf(PropTypes.string)
}

export default ColHeaderRow

