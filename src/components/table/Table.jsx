import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { connect } from 'react-redux'
import { interpret } from 'xstate'

import ColLabelRow from './ColLabelRow'
import DataRow from './DataRow'
import { getColumnNames } from '~/library/utils'
import getKeyboardNavMachine from './keyboardNavMachine'


const Grid = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  border-top: 2px solid ${props => props.theme.colors.cell.borderDark};
  border-left: 2px solid ${props => props.theme.colors.cell.borderDark};
  border-right: 1px solid ${props => props.theme.colors.cell.borderDark};
  border-bottom: 1px solid ${props => props.theme.colors.cell.borderDark};

  * {
    box-sizing: border-box;
  }

  .row-label-width {
    width: 34px;
  }

  .row-label-height {
    min-height: 28px;
  }

  .col-label-width {
    width: 140px;
  }

  .col-label-height {
    min-height: 26px;
  }
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
    this.colLabels = getColumnNames(props.columns)
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
    this.moveFocus(event.key, event.target.dataset.location)
  }

  moveFocus(key, location) {
    this.focusService.send({ type: 'MOVE_FOCUS', key, location })
  }

  renderColLabelRow(i) {
    return (
      <ColLabelRow
        key={i}
        rows={this.props.rows}
        colLabels={this.colLabels}
      />
    )
  }

  renderDataRows(rowNumber) {
    return (
      <DataRow
      key={rowNumber}
        rowNumber={rowNumber}
        colLabels={this.colLabels}
        activeCell={this.props.activeCell}
      />
    )
  }

  renderRows() {
    return new Array(this.props.rows + 1).fill(0).map((_, i) => {
      if (i === 0) {
        return this.renderColLabelRow(i)
      } else {
        return this.renderDataRows(i)
      }
    })
  }

  render() {
    return (
      <Grid
        data-table='app'
        onClick={this.handleTableOnClick}
        onKeyDown={this.handleTableOnKeyDown}
      >
        {this.renderRows()}
      </Grid>
    )
  }
}

const mapStateToProps = (state) => {
  const { activeCell, rows, columns } = state.global
  return { activeCell, rows, columns }
}

export default connect(mapStateToProps)(Table)
