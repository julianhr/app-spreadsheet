import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { connect }  from 'react-redux'

import { setCellValue, clearCellValue } from '~/actions/tableActions'


const Input = styled.input`
  display: flex;
  align-items: center;
  outline: none;
  border: 2px solid transparent;
  width: 100%;
  height: 100%;
  padding: 0 2px;
  line-height: 1em;

  :focus {
    border: 2px solid salmon;
  }
`

export class InputData extends React.PureComponent {
  static propTypes = {
    // props
    replaceValue: PropTypes.bool.isRequired,
    location: PropTypes.string.isRequired,
    onEscape: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    // redux
    clearCellValue: PropTypes.func.isRequired,
    formula: PropTypes.string,
    setCellValue: PropTypes.func.isRequired,
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

  setNewValue(rawValue) {
    const value = rawValue.trim()
    const { location } = this.props

    if (value.length === 0) {
      this.props.clearCellValue(location)
      return
    }

    const cellValue = {
      location,
      formula: value
    }

    const isFormula = value[0] === '='
    cellValue.text = isFormula ? this.evaluateFormula() : value
    this.props.setCellValue(cellValue)
  }

  evaluateFormula() {
    return 'pending evaluateFormula'
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

  render () {
    const defaultValue = this.props.replaceValue ? null : this.props.formula

    return (
      <Input
        ref={this.refInput}
        id={`f-${this.props.location}`}
        defaultValue={defaultValue}
        onKeyDown={this.handleOnKeyDown}
        onBlur={this.handleOnBlur}
      />
    )
  }
}

function mapStateToProps(state, ownProps) {
  const cell = state.table[ownProps.location]
  const formula = cell ? cell.formula : ''
  return { formula }
}
const mapDispatchToProps = { setCellValue, clearCellValue }

export default connect(mapStateToProps, mapDispatchToProps)(InputData)
