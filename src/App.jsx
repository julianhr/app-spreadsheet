import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from '@emotion/styled'

import Header from './components/header/Header'
import Table from './components/table/Table'
import CellInputter from './components/cellInputter/CellInputter'


const Container = styled.div`
  display: grid;
  grid:
    "left-blank main right-blank" 100vh
    / auto minmax(auto, 1000px) auto;
`

const Main = styled.main`
  grid-area: main;
`

function App({ cellInputter }) {
  return (
    <Container>
      <Main>
        {cellInputter &&  <CellInputter />}
        <div data-dummy-focus-stop tabIndex="0" />
        <Header />
        <Table />
      </Main>
    </Container>
  )
}

App.propTypes = {
  cellInputter: PropTypes.object,
  setActiveCell: PropTypes.func,
}

const mapStateToProps = (state) => ({ cellInputter: state.global.cellInputter })

export default connect(mapStateToProps)(App)
