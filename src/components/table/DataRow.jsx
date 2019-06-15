import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import RowHeader from '../cell/RowHeader'
// import CellData from '../cell/CellData'
import CellResult from '../cell/CellResult'


const Row = styled.div`
  display: flex;
  width: fit-content;
`

// function DataRow({ rowNumber, colLabels, activeCell }) {
function DataRow({ rowNumber, colLabels }) {
  const dataCells = () => (
    new Array(colLabels.length).fill(0).map((_, i) => {
      const location = `${colLabels[i]}-${rowNumber}`

      // return (
      //   <CellData
      //     key={i}
      //     isActive={activeCell === location}
      //     location={location}
      //   />
      // )
      return (
        <CellResult
          key={i}
          location={location}
        />
      )
    })
  )

  return (
    <Row
      data-row={rowNumber}
    >
      <RowHeader
        label={rowNumber}
      />
      {dataCells()}
    </Row>
  )
}

DataRow.propTypes = {
  rowNumber: PropTypes.number,
  colLabels: PropTypes.arrayOf(PropTypes.string),
  // activeCell: PropTypes.string,
}

export default DataRow

