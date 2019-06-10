import React from 'react'
import { render, fireEvent, cleanup } from 'react-testing-library'

import MockApp from '~/__tests__/__mocks__/MockApp'
import RowLabel from '../RowLabel'


const renderApp = (props) => {
  const wrapper = render(
    <MockApp>
      <table>
        <tr>
          <RowLabel {...props} />
        </tr>
      </table>
    </MockApp>
  )

  return wrapper
}

describe('RowLabel', () => {
  afterEach(cleanup)

  it('matches snapshot', () => {
    const props = {
      label: 1
    }

    renderApp(props)
    const el = document.querySelector('[data-row="1"]')
    expect(el).toMatchSnapshot()
  })
})
