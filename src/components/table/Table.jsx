import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { connect } from 'react-redux'
import { interpret } from 'xstate'

import CellData from '../cell/CellData'
import { getColumnNames } from '~/library/utils'
import getKeyboardNavMachine from './keyboardNavMachine'


const RootTable = styled.table`
  border-top: 2px solid ${props => props.theme.colors.cell.border};
  border-left: 2px solid ${props => props.theme.colors.cell.border};
  border-right: 1px solid ${props => props.theme.colors.cell.border};
  border-bottom: 1px solid ${props => props.theme.colors.cell.border};
`

const Td = styled.td`
  width: 130px;
  height: 26px;
`

export class Table extends React.PureComponent {
  static propTypes = {
    activeCell: PropTypes.string,
    rows: PropTypes.number.isRequired,
    columns: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)
    this.handleTableOnClick = this.handleTableOnClick.bind(this)
    this.handleTableOnKeyDown = this.handleTableOnKeyDown.bind(this)
    this.columnNames = getColumnNames(props.columns)
  }

  keyboardNavMachine = getKeyboardNavMachine(this.props.rows, this.props.columns)
  focusService = interpret(this.keyboardNavMachine)

  componentDidMount() {
    this.focusService.start()
  }

  componentWillUnmount() {
    this.focusService.stop()
  }

  handleTableOnClick(event) {
    event.stopPropagation()
  }

  handleTableOnKeyDown(event) {
    event.stopPropagation()
    this.moveFocus(event.key, event.target.id)
  }

  moveFocus(key, location) {
    this.focusService.send({ type: 'MOVE_FOCUS', key, location })
  }

  renderDataCells(rowNumber) {
    return new Array(this.props.columns).fill(0).map((_, i) => {
      const location = `${this.columnNames[i]}-${rowNumber}`

      return (
        <Td
          key={location}
        >
          <CellData
            isActive={this.props.activeCell === location}
            location={location}
          />
        </Td>
      )
    })
  }

  renderRows() {
    return new Array(this.props.rows).fill(0).map((_, i) => {
      return (
        <tr key={i}>
          {this.renderDataCells(i + 1)}
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

const mapStateToProps = (state) => {
  const { activeCell, rows, columns } = state.global
  return { activeCell, rows, columns }
}

export default connect(mapStateToProps)(Table)
