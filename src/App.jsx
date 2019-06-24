import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import Header from './components/header/Header'
import Table from './components/table/Table'
import FloatingInputter from './components/FloatingInputter/FloatingInputter'
import FormulaBar from './components/FormulaBar/FormulaBar'


const Container = styled.div`
  display: grid;
  grid:
    "left-blank main right-blank" 100vh
    / auto minmax(auto, 1000px) auto;
`

const Main = styled.main`
  grid-area: main;
`

function App() {
  return (
    <Container>
      <Main>
        <FloatingInputter />
        <div data-dummy-focus-stop tabIndex="0" />
        <Header />
        <FormulaBar />
        <Table />
      </Main>
    </Container>
  )
}

App.propTypes = {
  setActiveCell: PropTypes.func,
}

export default App
