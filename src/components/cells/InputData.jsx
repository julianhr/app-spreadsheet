import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { connect } from 'react-redux'

import { setCellData, clearCellData } from '~/actions/tableActions'


const Input = styled.input`
  display: flex;
  align-items: center;
  outline: none;
  height: 100%;
  width: 100%;
  border: 2px solid salmon;
  padding: 2px;
  box-sizing: border-box;
`

export class InputData extends React.PureComponent {
  static propTypes = {
    // props
    replaceValue: PropTypes.bool.isRequired,
    location: PropTypes.string.isRequired,
    onEscape: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    // redux
    clearCellData: PropTypes.func.isRequired,
    entered: PropTypes.string,
    setCellData: PropTypes.func.isRequired,
  }

  constructor() {
    super()
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this)
    this.handleOnBlur = this.handleOnBlur.bind(this)
  }

  refInput = React.createRef()

  componentDidMount() {
    this.focusInputTag()
  }

  focusInputTag() {
    const input = this.refInput.current
    input.focus()
    input.scrollLeft = input.scrollWidth
  }

  setNewValue(inputValue) {
    const { location } = this.props

    if (this.isWhitespace(inputValue)) {
      this.props.clearCellData(location)
      return
    }

    this.props.setCellData(location, inputValue)
  }

  handleOnKeyDown(event) {
    const { key } = event

    if (key === 'Escape') {
      this.props.onEscape()
    } else if (key === 'Enter') {
      this.setNewValue(event.target.value)
      this.props.onCommit()
    } else {
      event.stopPropagation()
    }
  }

  handleOnBlur(event) {
    this.setNewValue(event.target.value)
    this.props.onCommit()
  }

  isWhitespace(text) {
    return text.length === 0 || Boolean(text.match(/^\s+$/))
  }

  render() {
    const defaultValue = this.props.replaceValue ? null : this.props.entered

    return (
      <Input
        ref={this.refInput}
        data-cell='input'
        data-location={this.props.location}
        defaultValue={defaultValue}
        onKeyDown={this.handleOnKeyDown}
        onBlur={this.handleOnBlur}
      />
    )
  }
}

function mapStateToProps(state, ownProps) {
  const cell = state.table[ownProps.location]
  const entered = cell ? cell.entered : ''
  return { entered }
}

const mapDispatchToProps = { setCellData, clearCellData }

export default connect(mapStateToProps, mapDispatchToProps)(InputData)
