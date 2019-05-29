import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { connect } from 'react-redux'

import { clearCellValue } from '~/actions/tableActions'
import { setActiveCell } from '~/actions/globalActions'


const DataTag = styled.div`
  display: flex;
  align-items: center;
  outline: none;
  border: 2px solid transparent;
  width: 100%;
  height: 100%;
  padding: 0 2px;

  :focus {
    border: 2px solid salmon;
  }
`

export class EvaluatedData extends React.PureComponent {
  static propTypes = {
    // props
    isFocused: PropTypes.bool,
    location: PropTypes.string.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
    onKeyDownEditable: PropTypes.func.isRequired,
    // redux
    clearCellValue: PropTypes.func.isRequired,
    setActiveCell: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([
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
      const valueStr = '' + this.props.value

      if (valueStr.length > 0) {
        this.props.clearCellValue(this.props.location)
      }
      // key pressed is a printable symbol, ex: 'a', '1', ','
      // can be further refined, but for now it's fine
    } else if (key.length === 1) {
      this.props.onKeyDownEditable()
    }
  }

  render() {
    return (
      <DataTag
        ref={this.refDataTag}
        id={`t-${this.props.location}`}
        tabIndex='0'
        onKeyDown={this.handleOnKeyDown}
        onDoubleClick={this.props.onDoubleClick}
      >
        {this.props.value}
      </DataTag>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const cell = state.table[ownProps.location]
  const value = cell ? cell.value : ''
  return { value }
}

const mapDispatchToProps = { clearCellValue, setActiveCell }

export default connect(mapStateToProps, mapDispatchToProps)(EvaluatedData)
