import React from 'react'
import PropTypes from 'prop-types'
import Result from './Result'
import OutterBorder from './OutterBorder'


class ResultCell extends React.PureComponent {

  static propTypes = {
    location: PropTypes.string.isRequired,
  }

  refDatum = React.createRef()

  constructor() {
    super()
    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleOnDoubleClick = this.handleOnDoubleClick.bind(this)
  }

  focusDatum() {
    setTimeout(() => this.refDatum.current.focus(), 0)
  }

  handleOnClick() {
    this.focusDatum()
  }

  handleOnDoubleClick() {
    this.focusDatum()
  }

  render() {
    const { location } = this.props

    return (
      <OutterBorder
        onClick={this.handleOnClick}
        onDoubleClick={this.handleOnDoubleClick}
        location={location}
      >
        <Result
          location={location}
          fwdRef={this.refDatum}
        />
      </OutterBorder>
    )
  }
}

export default ResultCell
