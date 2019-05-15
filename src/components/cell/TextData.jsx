import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { connect } from 'react-redux'

import { clearCellValue } from '~/actions/tableActions'
import { setActiveCell } from '~/actions/globalActions'


const Text = styled.div`
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

export class TextData extends React.PureComponent {
  static propTypes = {
    // props
    isFocused: PropTypes.bool,
    location: PropTypes.string.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
    onKeyDownEditable: PropTypes.func.isRequired,
    // redux
    clearCellValue: PropTypes.func.isRequired,
    setActiveCell: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  }

  constructor() {
    super()
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this)
  }

  refText = React.createRef()

  componentDidMount() {
    this.focusTextTag()
  }

  focusTextTag() {
    if (this.props.isFocused) { this.refText.current.focus() }
  }

  handleOnKeyDown({ key }) {
    this.props.setActiveCell(this.props.location)

    if (['Delete', 'Backspace'].includes(key)) {
      if (this.props.text.length > 0) {
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
      <Text
        ref={this.refText}
        id={`t-${this.props.location}`}
        tabIndex='0'
        onKeyDown={this.handleOnKeyDown}
        onDoubleClick={this.props.onDoubleClick}
      >
        {this.props.text}
      </Text>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const cell = state.table[ownProps.location]
  const text = cell ? cell.text : ''
  return { text }
}

const mapDispatchToProps = { clearCellValue, setActiveCell }

export default connect(mapStateToProps, mapDispatchToProps)(TextData)
