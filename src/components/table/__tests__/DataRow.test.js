import React from 'react'
import { create } from 'react-test-renderer'
import { render, fireEvent, cleanup } from 'react-testing-library'

import MockApp from '~/__tests__/__mocks__/MockApp'
import DataRow from '../DataRow'


const renderApp = (props) => {
  const wrapper = render(
    <MockApp>
      <table>
        <DataRow {...props} />
      </table>
    </MockApp>
  )

  return wrapper
}

describe('DataRow', () => {
  afterEach(cleanup)

  it('matches snapshot', () => {
    const props = {
      rowNumber: 2,
      colLabels: ['A', 'B'],
      activeCell: 'B-2'
    }
    renderApp(props)
    const el = document.querySelector('tr')
    expect(el).toMatchSnapshot()
  })
})

