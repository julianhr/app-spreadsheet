import React from 'react'
import PropTypes from 'prop-types'

import RowLabel from '../cells/RowLabel'
import CellData from '../cells/CellData'


function DataRow({ rowNumber, colLabels, activeCell }) {
  const dataCells = () => (
    new Array(colLabels.length).fill(0).map((_, i) => {
      const location = `${colLabels[i]}-${rowNumber}`

      return (
        <CellData
          key={i}
          isActive={activeCell === location}
          location={location}
        />
      )
    })
  )

  return (
    <tr>
      <RowLabel
        label={rowNumber}
      />
      {dataCells()}
    </tr>
  )
}

DataRow.propTypes = {
  rowNumber: PropTypes.number,
  colLabels: PropTypes.arrayOf(PropTypes.string),
  activeCell: PropTypes.string,
}

export default DataRow

