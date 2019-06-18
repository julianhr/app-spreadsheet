/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core' // eslint-disable-line
import { connect } from 'react-redux'

import { clearCellData } from '~/actions/tableDataActions'
import { openCellInputter, setActiveCell } from '~/actions/globalActions'
import { DEFAULT_COL_WIDTH } from '~/library/constants'


const Root = styled.div`
  cursor: cell;
  overflow: hidden;
  font-size: 13px;
  border-right: 1px solid ${props => props.theme.colors.cell.border};
  border-bottom: 1px solid ${props => props.theme.colors.cell.border};
`

const Cell = styled.div`
  display: flex;
  align-items: center;
  outline: none;
  border: 2px solid transparent;
  line-height: 1.1em;
  height: 100%;
  width: 100%;
  padding: 2px;

  :focus, :focus-within {
    border: 2px solid salmon;
  }
`

export class CellResult extends React.PureComponent {
  static propTypes = {
    // props
    // isFocused: PropTypes.bool,
    location: PropTypes.string.isRequired,
    // onDoubleClick: PropTypes.func.isRequired,
    // onKeyDownEditable: PropTypes.func.isRequired,
    openCellInputter: PropTypes.func.isRequired,
    // redux
    clearCellData: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number,
    setActiveCell: PropTypes.func.isRequired,
    result: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  }

  static defaultProps = {
    width: DEFAULT_COL_WIDTH,
  }

  constructor() {
    super()
    this.handleCellOnFocus = this.handleCellOnFocus.bind(this)
    this.handleCellOnKeyDown = this.handleCellOnKeyDown.bind(this)
    this.handleCellOnDoubleClick = this.handleCellOnDoubleClick.bind(this)
    this.handleCellOnClick = this.handleCellOnClick.bind(this)
    this.handleRootOnClick = this.handleRootOnClick.bind(this)
  }

  refCell = React.createRef()

  // componentDidMount() {
  //   this.focusCell()
  // }

  // focusCell() {
  //   if (this.props.isFocused) { this.refCell.current.focus() }
  // }

  openCellInputter(willReplaceValue) {
    const cellDomRect = this.refCell.current.getBoundingClientRect()
    const cellRect = JSON.parse(JSON.stringify(cellDomRect))
    this.props.openCellInputter(cellRect, willReplaceValue)
  }

  getRootStyle() {
    const { width, height } = this.props

    return {
      width,
      height: height && height
    }
  }

  getCellStyle() {
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

  handleRootOnClick() {
    this.refCell.current.focus()
  }

  handleCellOnFocus() {
    this.props.setActiveCell(this.props.location)
  }

  handleCellOnKeyDown({ key }) {
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

  handleCellOnDoubleClick() {
    this.openCellInputter(false)
  }

  handleCellOnClick(event) {
    event.stopPropagation()
  }

  render() {
    return (
      <Root
        onClick={this.handleRootOnClick}
        css={this.getRootStyle()}
      >
        <Cell
          ref={this.refCell}
          data-cell='result'
          data-location={this.props.location}
          css={this.getCellStyle()}
          tabIndex='0'
          onClick={this.handleCellOnClick}
          onKeyDown={this.handleCellOnKeyDown}
          onDoubleClick={this.handleCellOnDoubleClick}
          onFocus={this.handleCellOnFocus}
        >
          {this.props.result}
        </Cell>
      </Root>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const [colLabel, rowLabel] = ownProps.location.split('-')
  const cell = state.tableData[ownProps.location]
  const result = cell ? cell.result : ''
  const width = state.tableMeta.colWidths[colLabel]
  const height = state.tableMeta.rowHeights[rowLabel]
  return { result, width, height }
}

const mapDispatchToProps = { clearCellData, openCellInputter, setActiveCell }

export default connect(mapStateToProps, mapDispatchToProps)(CellResult)
