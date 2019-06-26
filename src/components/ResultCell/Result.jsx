import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { unscheduleFloatingInputter } from '~/actions/globalActions'
import { clearCellData } from '~/actions/tableDataActions'
import { openFloatingInputter, setActiveCell } from '~/actions/globalActions'
import Datum from './Datum'


export class Result extends React.PureComponent {

  static propTypes = {
    // props
    location: PropTypes.string.isRequired,
    fwdRef: PropTypes.object.isRequired,
    // redux
    clearCellData: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    openFloatingInputter: PropTypes.func.isRequired,
    result: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    scheduledFloatingInputter: PropTypes.shape({
      willOpen: PropTypes.bool,
      isInteractive: PropTypes.bool,
    }).isRequired,
    setActiveCell: PropTypes.func.isRequired,
    unscheduleFloatingInputter: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleOnDoubleClick = this.handleOnDoubleClick.bind(this)
    this.handleOnFocus = this.handleOnFocus.bind(this)
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this)
    this.refDatum = props.fwdRef
  }

  componentDidUpdate() {
    this.scheduledFloatingInputter()
  }

  scheduledFloatingInputter() {
    if (!this.props.isActive) { return }
    if (!this.props.scheduledFloatingInputter.willOpen) { return }

    const { isInteractive } = this.props.scheduledFloatingInputter
    this.props.unscheduleFloatingInputter()
    this.openFloatingInputter(isInteractive)
  }

  openFloatingInputter(isInteractive, replaceValue) {
    const datumRect = this.refDatum.current.getBoundingClientRect()
    const cellRect = JSON.parse(JSON.stringify(datumRect))
    this.props.openFloatingInputter(cellRect, isInteractive, replaceValue)
  }

  handleOnFocus() {
    this.props.setActiveCell(this.props.location)
  }

  handleOnClick(event) {
    event.stopPropagation()
  }

  handleOnDoubleClick(event) {
    event.stopPropagation()
    this.openFloatingInputter(true)
  }

  handleOnKeyDown({ key }) {
    if (['Delete', 'Backspace'].includes(key)) {
      const valueStr = '' + this.props.result

      if (valueStr.length > 0) {
        this.props.clearCellData(this.props.location)
      }
      // key pressed is a printable symbol, ex: 'a', '1', ','
      // can be further refined, but for now it's fine
    } else if (key.length === 1) {
      this.openFloatingInputter(true, key)
    }
  }

  render() {
    return (
      <Datum
        fwdRef={this.refDatum}
        location={this.props.location}
        result={this.props.result}
        onClick={this.handleOnClick}
        onDoubleClick={this.handleOnDoubleClick}
        onFocus={this.handleOnFocus}
        onKeyDown={this.handleOnKeyDown}
        isActive={this.props.isActive}
      />
    )
  }
}

function mapStateToProps(state, ownProps) {
  const isActive = state.global.activeCell.location === ownProps.location
  const { scheduledFloatingInputter } = state.global
  const cell = state.tableData[ownProps.location]
  const result = cell ? cell.result : ''
  return { result, isActive, scheduledFloatingInputter }
}

const mapDispatchToProps = {
  clearCellData,
  openFloatingInputter,
  setActiveCell,
  unscheduleFloatingInputter,
}

export default connect(mapStateToProps, mapDispatchToProps)(Result)
