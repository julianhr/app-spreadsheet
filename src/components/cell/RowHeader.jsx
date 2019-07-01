/* @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core'
import { connect } from 'react-redux'

import { setRowHeight } from '~/actions/tableMetaActions'
import { DEFAULT_ROW_HEIGHT, MIN_ROW_HEIGHT, MAX_ROW_HEIGHT } from '~/library/constants'
import { debounce, clamp } from '~/library/utils'


export const ROW_HEADER_WIDTH = 50

const Root = styled.div`
  position: sticky;
  left: 0;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${props => props.theme.colors.table.borderDark};
  border-bottom: 1px solid ${props => props.theme.colors.table.borderDark};
  background: ${props => props.theme.colors.table.labelBkg};
`

const BtnHeight = styled.button`
  background: transparent;
  cursor: row-resize;
  outline: none;
  position: absolute;
  width: 100%;
  height: 6px;
  margin: 0 0 -3px 0;
  border: 0;
  padding: 0;
  left: 0;
  bottom: 0;
  z-index: 1;

  :hover {
    background: ${props => props.theme.colors.primary.light};
  }
`

class RowHeader extends React.PureComponent {

  static propTypes = {
    label: PropTypes.number.isRequired,
    setRowHeight: PropTypes.func.isRequired,
    height: PropTypes.number,
  }

  constructor() {
    super()
    this.handleBtnHeightOnMouseDown = this.handleBtnHeightOnMouseDown.bind(this)
    this.handleDocumentMouseMove = this.handleDocumentMouseMove.bind(this)
    this.handleDocumentMouseUp = this.handleDocumentMouseUp.bind(this)
    this.debSetRowHeight = this.debSetRowHeight.bind(this)
  }

  state = {
    pageY: 0,
    height: 0,
    btnBottom: 0,
    isResizing: false,
  }

  refRoot = React.createRef()

  getRootStyle() {
    const { height } = this.props
    const style = {
      width: ROW_HEADER_WIDTH
    }

    if (height) {
      style.height = height
    } else {
      style.minHeight = DEFAULT_ROW_HEIGHT
      style.height = 'auto'
    }

    return style
  }

  getBtnHeightStyle() {
    if (!this.state.isResizing) { return }

    const newBottom = this.state.btnBottom
    const minBottom = MIN_ROW_HEIGHT - this.state.height
    const maxBottom = MAX_ROW_HEIGHT - this.state.height
    const bottom = -(clamp(newBottom, minBottom, maxBottom) - 4)

    return (theme) => css`
      height: 1.5px;
      width: 95vw;
      bottom: ${bottom}px;
      background: ${theme.colors.primary.light};
    `
  }

  debSetRowHeight = debounce((event) => {
    const delta = event.pageY - this.state.pageY
    this.setState({ btnBottom: delta, })
  }, 40)

  handleDocumentMouseMove(event) {
    this.debSetRowHeight(event)
  }

  handleDocumentMouseUp(event) {
    const delta = event.pageY - this.state.pageY
    const height = this.state.height + delta

    this.props.setRowHeight(this.props.label, height)
    this.setState({ btnBottom: 0, isResizing: false })
    document.removeEventListener('mousemove', this.handleDocumentMouseMove)
    document.removeEventListener('mouseup', this.handleDocumentMouseUp)
  }

  handleBtnHeightOnMouseDown(event) {
    event.preventDefault()

    this.setState({
      pageY: event.pageY,
      height: this.props.height || this.refRoot.current.getBoundingClientRect().height,
      isResizing: true,
    })

    document.addEventListener('mousemove', this.handleDocumentMouseMove)
    document.addEventListener('mouseup', this.handleDocumentMouseUp)
  }

  render() {
    const { label } = this.props

    return (
      <Root
        ref={this.refRoot}
        data-row={label}
        className='row-header-width'
        css={this.getRootStyle()}
      >
        {label}
        <BtnHeight
          css={this.getBtnHeightStyle()}
          tabIndex='-1'
          onMouseDown={this.handleBtnHeightOnMouseDown}
          onMouseMove={this.handleBtnHeightOnMouseMove}
          onMouseUp={this.handleBtnHeightOnMouseUp}
        />
      </Root>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const height = state.tableMeta.rowHeights[ownProps.label]
  return { height }
}

const mapDispatchToProps = { setRowHeight }

export default connect(mapStateToProps, mapDispatchToProps)(RowHeader)
