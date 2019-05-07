import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { connect } from 'react-redux'

import Cell from '../cell/Cell'


const RootTable = styled.table`
  border: 2px solid lightgray;
  border-collapse: collapse;
  border-spacing: 0px;

  td {
    padding: 0;
    border: 1px dotted #bbb;
  }
`

class Table extends React.PureComponent {
  static propTypes = {
    activeCell: PropTypes.string,
    rows: PropTypes.number,
    columns: PropTypes.number,
  }

  handleTableOnClick = (event) => {
    event.stopPropagation()
  }

  handleTableOnKeyDown = (event) => {
    event.stopPropagation()
    this.moveFocus(event.key, event.target.dataset.location)
  }

  moveFocus(key, location) {
    const { rows, columns } = this.props
    const currRow = location.codePointAt(0) - 'a'.codePointAt(0)
    const currCol = Number.parseInt(location[1]) - 1
    let nextRow = currRow
    let nextCol = currCol

    if ('ArrowUp' === key) { nextRow = currRow - 1 }
    else if ('ArrowRight' === key) { nextCol = currCol + 1 }
    else if (['ArrowDown', 'Enter'].includes(key)) { nextRow = currRow + 1 }
    else if ('ArrowLeft' === key) { nextCol = currCol - 1 }
    else { return }

    if (Math.min(nextRow, nextCol) >= 0 && nextRow < rows && nextCol < columns) {
      nextRow = String.fromCodePoint('a'.codePointAt(0) + nextRow)
      nextCol = nextCol + 1
      document.querySelector(`#${nextRow}${nextCol}`).focus()
    }
  }

  renderCells(rowLocation) {
    return new Array(this.props.columns).fill(0).map((_, i) => {
      const location = rowLocation + (i+1)

      return (
        <td
          key={location}
        >
          <Cell
            isActive={this.props.activeCell === location}
            location={location}
          />
        </td>
      )
    })
  }

  renderRows() {
    return new Array(this.props.rows).fill(0).map((_, i) => {
      const rowLocation = String.fromCharCode('a'.charCodeAt(0) + i)

      return (
        <tr key={i}>
          {this.renderCells(rowLocation)}
        </tr>
      )
    })
  }

  render() {
    return (
      <RootTable
        onClick={this.handleTableOnClick}
        onKeyDown={this.handleTableOnKeyDown}
      >
        <tbody>
          {this.renderRows()}
        </tbody>
      </RootTable>
    )
  }
}

const mapStateToProps = (props) => {
  const { activeCell, rows, columns } = props
  return { activeCell, rows, columns }
}

export default connect(mapStateToProps)(Table)
