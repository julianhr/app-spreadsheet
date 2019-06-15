import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import ColHeader from '../cell/ColHeader'


const Row = styled.div`
  display: flex;
  width: fit-content;
`

const InnerBorder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${props => props.theme.colors.cell.borderDark};
  border-bottom: 1px solid ${props => props.theme.colors.cell.borderDark};
  background: ${props => props.theme.colors.cell.labelBkg};
`

function ColHeaderRow({ colLabels }) {
  const renderCornerCell = () => (
    <InnerBorder
      className='row-label-width col-label-height'
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

