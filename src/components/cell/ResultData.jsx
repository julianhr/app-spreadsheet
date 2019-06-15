/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core' // eslint-disable-line
import { connect } from 'react-redux'

import { clearCellData } from '~/actions/tableDataActions'
import { setActiveCell } from '~/actions/globalActions'


const DataTag = styled.div`
  display: flex;
  align-items: center;
  outline: none;
  border: 2px solid transparent;
  line-height: 1.1em;
  height: 100%;
  width: 100%;
  padding: 2px;

  :focus {
    border: 2px solid salmon;
  }
`

export class ResultData extends React.PureComponent {
  static propTypes = {
    // props
    isFocused: PropTypes.bool,
    location: PropTypes.string.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
    onKeyDownEditable: PropTypes.func.isRequired,
    // redux
    clearCellData: PropTypes.func.isRequired,
    setActiveCell: PropTypes.func.isRequired,
    result: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  }

  constructor() {
    super()
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this)
  }

  refDataTag = React.createRef()

  componentDidMount() {
    this.focusDataTag()
  }

  focusDataTag() {
    if (this.props.isFocused) { this.refDataTag.current.focus() }
  }

  handleOnKeyDown({ key }) {
    this.props.setActiveCell(this.props.location)

    if (['Delete', 'Backspace'].includes(key)) {
      const valueStr = '' + this.props.result

      if (valueStr.length > 0) {
        this.props.clearCellData(this.props.location)
      }
      // key pressed is a printable symbol, ex: 'a', '1', ','
      // can be further refined, but for now it's fine
    } else if (key.length === 1) {
      this.props.onKeyDownEditable()
    }
  }

  getStyle() {
    let style = {}

    if (typeof this.props.result === 'number') {
      style = {
        whiteSpace: 'nowrap',
        textOverflow: 'clip',
        overflow: 'hidden',
      }
    }

    return style
  }

  render() {
    return (
      <DataTag
        ref={this.refDataTag}
        data-cell='result'
        data-location={this.props.location}
        css={this.getStyle()}
        tabIndex='0'
        onKeyDown={this.handleOnKeyDown}
        onDoubleClick={this.props.onDoubleClick}
      >
        {this.props.result}
      </DataTag>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const cell = state.tableData[ownProps.location]
  const result = cell ? cell.result : ''
  return { result }
}

const mapDispatchToProps = { clearCellData, setActiveCell }

export default connect(mapStateToProps, mapDispatchToProps)(ResultData)
