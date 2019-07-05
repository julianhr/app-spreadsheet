import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { connect } from 'react-redux'

import { setCellData } from '~/actions/tableDataActions'
import CellValueSetter from './CellValueSetter'


const Root = styled.div`
  width: 100%;
  height: 100%;
`

function Wrapper(props) {

  const cellValueSetter = new CellValueSetter(props)
  const refRoot = React.createRef()

  function setNewCellValue(event) {
    if (refRoot.current.contains(event.targetElement)) { return }
    if (props.keyEvent.key === 'Escape') { return }
    cellValueSetter.run()
  }

  function handleOnBlur(event) {
    setNewCellValue(event)
    props.onCommit()
  }

  return (
    <Root
      ref={refRoot}
      onBlur={handleOnBlur}
    >
      {props.children}
    </Root>
  )
}

Wrapper.propTypes = {
  children: PropTypes.any,
  entered: PropTypes.string.isRequired,
  keyEvent: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
  onCommit: PropTypes.func,
  setCellData: PropTypes.func.isRequired,
  valueEvent: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  const {
    global: {
      inputter: {
        valueEvent,
      },
    }
  } = state

  return {
    valueEvent,
  }
}

const mapDispatchToProps = {
  setCellData,
}

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)
