import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'

import MockApp from '~/__tests__/__mocks__/MockApp'
import ColLabelRow from '../ColLabelRow'


const renderApp = (props) => {
  const wrapper = render(
    <MockApp>
      <table>
        <ColLabelRow {...props} />
      </table>
    </MockApp>
  )

  return wrapper
}

describe('ColLabelRow', () => {
  afterEach(cleanup)

  it('matches snapshot', () => {
    const colLabels = ['A', 'B']
    const props = { colLabels }
    renderApp(props)
    const el = document.querySelector('[data-row="header"]')
    expect(el).toMatchSnapshot()
  })
})

