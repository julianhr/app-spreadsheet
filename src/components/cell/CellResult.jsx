/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core' // eslint-disable-line
import { connect } from 'react-redux'

import { clearCellData } from '~/actions/tableActions'
import { displayInputter, setActiveCell } from '~/actions/globalActions'


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
    displayInputter: PropTypes.func.isRequired,
    // redux
    clearCellData: PropTypes.func.isRequired,
    // setActiveCell: PropTypes.func.isRequired,
    result: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
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

  displayInputter(willReplaceValue) {
    const { location } = this.props
    const cellDomRect = this.refCell.current.getBoundingClientRect()
    const cellRect = JSON.parse(JSON.stringify(cellDomRect))

    this.props.displayInputter({
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
      this.displayInputter(true)
    }
  }

  handleCellOnDoubleClick() {
    this.displayInputter(false)
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
        className='row-label-height col-label-width'
        onClick={this.handleWrapperOnClick}
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
  const cell = state.table[ownProps.location]
  const result = cell ? cell.result : ''
  return { result }
}

const mapDispatchToProps = { clearCellData, displayInputter, setActiveCell }

export default connect(mapStateToProps, mapDispatchToProps)(ResultCell)
