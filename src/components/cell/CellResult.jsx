/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core' // eslint-disable-line
import { connect } from 'react-redux'

import { clearCellData } from '~/actions/tableDataActions'
import { displayCellInputter, setActiveCell } from '~/actions/globalActions'
import { DEFAULT_COL_WIDTH } from '~/library/constants'


const Wrapper = styled.div`
  cursor: cell;
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

export class ResultCell extends React.PureComponent {
  static propTypes = {
    // props
    // isFocused: PropTypes.bool,
    location: PropTypes.string.isRequired,
    // onDoubleClick: PropTypes.func.isRequired,
    // onKeyDownEditable: PropTypes.func.isRequired,
    displayCellInputter: PropTypes.func.isRequired,
    // redux
    clearCellData: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    // setActiveCell: PropTypes.func.isRequired,
    result: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  }

  static defaultProps = {
    width: DEFAULT_COL_WIDTH
  }

  constructor() {
    super()
    this.handleCellOnKeyDown = this.handleCellOnKeyDown.bind(this)
    this.handleCellOnDoubleClick = this.handleCellOnDoubleClick.bind(this)
    this.handleCellOnClick = this.handleCellOnClick.bind(this)
    this.handleWrapperOnClick = this.handleWrapperOnClick.bind(this)
  }

  refCell = React.createRef()

  // componentDidMount() {
  //   this.focusCell()
  // }

  // focusCell() {
  //   if (this.props.isFocused) { this.refCell.current.focus() }
  // }

  displayCellInputter(willReplaceValue) {
    const { location } = this.props
    const cellDomRect = this.refCell.current.getBoundingClientRect()
    const cellRect = JSON.parse(JSON.stringify(cellDomRect))

    this.props.displayCellInputter({
      location,
      willReplaceValue,
      cellRect,
    })
  }

  handleCellOnKeyDown({ key }) {
    this.props.setActiveCell(this.props.location)

    if (['Delete', 'Backspace'].includes(key)) {
      const valueStr = '' + this.props.result

      if (valueStr.length > 0) {
        this.props.clearCellData(this.props.location)
      }
      // key pressed is a printable symbol, ex: 'a', '1', ','
      // can be further refined, but for now it's fine
    } else if (key.length === 1) {
      this.displayCellInputter(true)
    }
  }

  handleCellOnDoubleClick() {
    this.displayCellInputter(false)
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

  handleWrapperOnClick() {
    this.refCell.current.focus()
  }

  handleCellOnClick(event) {
    event.stopPropagation()
  }

  render() {
    return (
      <Wrapper
        className='row-label-height'
        onClick={this.handleWrapperOnClick}
        css={css`
          width: ${this.props.width}px;
        `}
      >
        <Cell
          ref={this.refCell}
          data-cell='result'
          data-location={this.props.location}
          css={this.getStyle()}
          tabIndex='0'
          onClick={this.handleCellOnClick}
          onKeyDown={this.handleCellOnKeyDown}
          onDoubleClick={this.handleCellOnDoubleClick}
        >
          {this.props.result}
        </Cell>
      </Wrapper>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const [colLabel, _] = ownProps.location.split('-')
  const cell = state.tableData[ownProps.location]
  const result = cell ? cell.result : ''
  const width = state.tableMeta.colWidths[colLabel]
  return { result, width }
}

const mapDispatchToProps = { clearCellData, displayCellInputter, setActiveCell }

export default connect(mapStateToProps, mapDispatchToProps)(ResultCell)
