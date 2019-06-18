import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { connect } from 'react-redux'
import { interpret } from 'xstate'

import ColHeaderRow from './ColHeaderRow'
import DataRow from './DataRow'
import { getColumnNames } from '~/library/utils'
import getKeyboardNavMachine from './keyboardNavMachine'


const Grid = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  overflow: hidden;
  border-top: 2px solid ${props => props.theme.colors.cell.borderDark};
  border-left: 2px solid ${props => props.theme.colors.cell.borderDark};
  border-right: 1px solid ${props => props.theme.colors.cell.borderDark};
  border-bottom: 1px solid ${props => props.theme.colors.cell.borderDark};

  * {
    box-sizing: border-box;
  }
`

export class Table extends React.PureComponent {
  static propTypes = {
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
    const { location } = event.target.dataset

    if (location) {
      this.moveFocus(event.key, event.target.dataset.location)
    }
  }

  moveFocus(key, location) {
    this.focusService.send({ type: 'MOVE_FOCUS', key, location })
  }

  renderColHeaderRow(i) {
    return (
      <ColHeaderRow
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
      />
    )
  }

  renderRows() {
    return new Array(this.props.rows + 1).fill(0).map((_, i) => {
      if (i === 0) {
        return this.renderColHeaderRow(i)
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
  const { rows, columns } = state.global
  return { rows, columns }
}

export default connect(mapStateToProps)(Table)
