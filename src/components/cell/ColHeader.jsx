/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core' // eslint-disable-line
import { connect } from 'react-redux'

import { setColWidth } from '~/actions/tableMetaActions'
import { DEFAULT_COL_WIDTH, MIN_COL_WIDTH, MAX_COL_WIDTH } from '~/library/constants'
import { debounce, clamp } from '~/library/utils'


let Root = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${props => props.theme.colors.table.borderDark};
  border-bottom: 1px solid ${props => props.theme.colors.table.borderDark};
  background: ${props => props.theme.colors.table.labelBkg};
  font-size: 12px;
`

const BtnWidth = styled.button`
  background: transparent;
  cursor: col-resize;
  outline: none;
  position: absolute;
  height: 100%;
  margin: 0 -3px 0 0;
  width: 6px;
  border: 0;
  padding: 0;
  right: 0;
  top: 0;
  z-index: 2;

  :hover {
    background: ${props => props.theme.colors.primary.light};
  }
`

class ColHeader extends React.PureComponent {

  static propTypes = {
    label: PropTypes.string.isRequired,
    setColWidth: PropTypes.func.isRequired,
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

    const newRight = this.state.btnRight
    const minRight = MIN_COL_WIDTH - this.state.width
    const maxRight = MAX_COL_WIDTH - this.state.width
    const right = -(clamp(newRight, minRight, maxRight) - 4)

    return (theme) => css`
      width: 1.5px;
      height: 90vh;
      right: ${right}px;
      background: ${theme.colors.primary.light};
    `
  }

  debSetColWidth = debounce(40, (event) => {
    const delta = event.pageX - this.state.pageX
    this.setState({ btnRight: delta, })
  })

  handleDocumentMouseMove(event) {
    this.debSetColWidth(event)
  }

  handleDocumentMouseUp(event) {
    const delta = event.pageX - this.state.pageX
    const width = this.state.width + delta

    this.props.setColWidth(this.props.label, width)
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

  render() {
    const { label, width } = this.props

    return (
      <Root
        data-col={label}
        className='col-label-height'
        css={css`
          width: ${width}px;
          height: 26px;
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
      </Root>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const width = state.tableMeta.colWidths[ownProps.label]
  return { width }
}

const mapDispatchToProps = { setColWidth }

export default connect(mapStateToProps, mapDispatchToProps)(ColHeader)
