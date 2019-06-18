import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { clearCellData } from '~/actions/tableDataActions'
import { openCellInputter, setActiveCell } from '~/actions/globalActions'
import Datum from './Datum'


export class Result extends React.PureComponent {

  static propTypes = {
    // props
    location: PropTypes.string.isRequired,
    fwdRef: PropTypes.object.isRequired,
    // redux
    openCellInputter: PropTypes.func.isRequired,
    clearCellData: PropTypes.func.isRequired,
    setActiveCell: PropTypes.func.isRequired,
    result: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  }

  constructor(props) {
    super()
    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleOnDoubleClick = this.handleOnDoubleClick.bind(this)
    this.handleOnFocus = this.handleOnFocus.bind(this)
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this)
    this.refDatum = props.fwdRef
  }

  openCellInputter(willReplaceValue) {
    const datumRect = this.refDatum.current.getBoundingClientRect()
    const cellRect = JSON.parse(JSON.stringify(datumRect))
    this.props.openCellInputter(cellRect, willReplaceValue)
  }

  handleOnFocus() {
    this.props.setActiveCell(this.props.location)
  }

  handleOnClick(event) {
    event.stopPropagation()
  }

  handleOnDoubleClick(event) {
    event.stopPropagation()
    this.openCellInputter(false)
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
      this.openCellInputter(true)
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
      />
    )
  }
}

function mapStateToProps(state, ownProps) {
  const cell = state.tableData[ownProps.location]
  const result = cell ? cell.result : ''
  return { result }
}

const mapDispatchToProps = { clearCellData, openCellInputter, setActiveCell }

export default connect(mapStateToProps, mapDispatchToProps)(Result)
