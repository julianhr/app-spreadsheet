import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from '@emotion/styled'

import { setActiveCell } from './actions/globalActions'
import Header from './components/header/Header'
import Table from './components/table/Table'


const Container = styled.div`
  display: grid;
  grid:
    "left-blank main right-blank" 100vh
    / auto minmax(auto, 1000px) auto;
`

const Main = styled.main`
  grid-area: main;
`

function App({ setActiveCell }) {
  const handleOnClick = () => {
    setActiveCell(null)
  }

  return (
    <Container
      onClick={handleOnClick}
    >
      <Main>
        <Header />
        <Table />
      </Main>
    </Container>
  )
}

App.propTypes = {
  setActiveCell: PropTypes.func,
}

const mapDispatchToProps = { setActiveCell }

export default connect(null, mapDispatchToProps)(App)
