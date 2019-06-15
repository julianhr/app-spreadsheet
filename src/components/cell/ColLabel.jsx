/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core' // eslint-disable-line
import { connect } from 'react-redux'

import { setColWidthDelta } from '~/actions/tableMetaActions'
import { DEFAULT_COL_WIDTH, MIN_COL_WIDTH } from '~/library/constants'
import { debounce } from '~/library/utils'


let InnerBorder = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${props => props.theme.colors.cell.borderDark};
  border-bottom: 1px solid ${props => props.theme.colors.cell.borderDark};
  background: ${props => props.theme.colors.cell.labelBkg};
  font-size: 12px;
`

const BtnWidth = styled.button`
  background: transparent;
  cursor: col-resize;
  outline: none;
  position: absolute;
  border: 3px solid transparent;
  height: 100%;
  margin: 0 -4px 0 0;
  padding: 1px;
  right: 0;
  top: 0;
  z-index: 1;
`

class ColLabel extends React.PureComponent {

  static propTypes = {
    label: PropTypes.string.isRequired,
    setColWidthDelta: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
  }

  static defaultProps = {
    width: DEFAULT_COL_WIDTH,
  }

  constructor() {
    super()
    this.handleBtnWidthOnMouseDown = this.handleBtnWidthOnMouseDown.bind(this)
    this.handleDocumentMouseMove = this.handleDocumentMouseMove.bind(this)
    this.handleDocumentMouseUp = this.handleDocumentMouseUp.bind(this)
    this.debSetColWidth = this.debSetColWidth.bind(this)
  }

  state = {
    pageX: 0,
    width: 0,
    btnRight: 0,
    isResizing: false,
  }

  getBtnWidthStyle() {
    if (!this.state.isResizing) { return }

    const newRight = this.state.btnRight + 4
    const minRight = this.state.width - MIN_COL_WIDTH
    const right = Math.min(newRight, minRight)

    return (theme) => css`
      right: ${right}px;
      margin-top: -70px;
      height: 95vh;
      border: 0;
      background: ${theme.colors.primary.live};
    `
  }

  debSetColWidth = debounce(40, (event) => {
    const delta = this.state.pageX - event.pageX
    this.setState({ btnRight: delta, })
  })

  handleDocumentMouseMove(event) {
    this.debSetColWidth(event)
  }

  handleDocumentMouseUp(event) {
    const delta = event.pageX - this.state.pageX
    const width = this.state.width + delta

    this.props.setColWidthDelta(this.props.label, width)
    this.setState({ btnRight: 0, isResizing: false })
    document.removeEventListener('mousemove', this.handleDocumentMouseMove)
    document.removeEventListener('mouseup', this.handleDocumentMouseUp)
  }

  handleBtnWidthOnMouseDown(event) {
    event.preventDefault()

    this.setState({
      pageX: event.pageX,
      width: this.props.width,
      isResizing: true,
    })

    document.addEventListener('mousemove', this.handleDocumentMouseMove)
    document.addEventListener('mouseup', this.handleDocumentMouseUp)
  }
  
  // handleBtnWidthOnMouseMove(event) {
  //   if (!this.state.isSettingWidth) { return }
  //   document.addEventListener('mousemove', (event) => {

  //   })
  //   const { pageX, pageY } = event
  //   console.log('handle', pageX, pageY)
  // }

  render() {
    const { label, width } = this.props

    return (
      <InnerBorder
        data-col={label}
        className='col-label-height'
        css={css`
          width: ${width}px;
        `}
      >
        {label}
        <BtnWidth
          css={this.getBtnWidthStyle()}
          tabIndex='-1'
          onMouseDown={this.handleBtnWidthOnMouseDown}
          onMouseMove={this.handleBtnWidthOnMouseMove}
          onMouseUp={this.handleBtnWidthOnMouseUp}
        />
      </InnerBorder>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const width = state.tableMeta.colWidths[ownProps.label]
  return { width }
}

const mapDispatchToProps = { setColWidthDelta }

export default connect(mapStateToProps, mapDispatchToProps)(ColLabel)
