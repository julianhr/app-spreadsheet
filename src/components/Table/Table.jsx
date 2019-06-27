import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { connect } from 'react-redux'
import { interpret } from 'xstate'

import { setActiveCell } from '~/actions/globalActions'
import ColHeaderRow from './ColHeaderRow'
import DataRow from './DataRow'
import { getColumnNames } from '~/library/utils'
import getKeyboardNavMachine from './keyboardNavMachine'


const Grid = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 60vh;
  min-height: 300px;
  border-top: 2px solid ${props => props.theme.colors.table.borderDark};
  border-left: 2px solid ${props => props.theme.colors.table.borderDark};
  border-right: 1px solid ${props => props.theme.colors.table.borderDark};
  border-bottom: 1px solid ${props => props.theme.colors.table.borderDark};
  overflow: scroll;

  * {
    box-sizing: border-box;
  }
`

export class Table extends React.PureComponent {
  static propTypes = {
    rows: PropTypes.number.isRequired,
    columns: PropTypes.number.isRequired,
    setActiveCell: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this)
    this.colLabels = getColumnNames(props.columns)
  }

  keyboardNavMachine = getKeyboardNavMachine(this.props.rows, this.props.columns)
  focusService = interpret(this.keyboardNavMachine)
  refGrid = React.createRef()

  componentDidMount() {
    this.focusService.start()
    this.props.setActiveCell('A-1')
    this.focusA_1()
  }

  componentWillUnmount() {
    this.focusService.stop()
  }

  focusA_1() {
    const el = document.querySelector('[data-location="A-1"]')
    el && el.focus()
  }

  handleOnClick(event) {
    event.stopPropagation()
  }

  handleOnKeyDown(event) {
    event.stopPropagation()
    event.preventDefault()

    const { location } = event.target.dataset

    if (location) {
      this.moveFocus(event, event.target.dataset.location)
    }
  }

  moveFocus(event, location) {
    const { key, altKey, ctrlKey, shiftKey } = event
    const keyEvent = { key, altKey, ctrlKey, shiftKey }
    this.focusService.send({ type: 'MOVE_FOCUS', keyEvent, location })
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
        ref={this.refGrid}
        data-table='app'
        onClick={this.handleOnClick}
        onKeyDown={this.handleOnKeyDown}
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

const mapDisptachToProps = { setActiveCell }

export default connect(mapStateToProps, mapDisptachToProps)(Table)
