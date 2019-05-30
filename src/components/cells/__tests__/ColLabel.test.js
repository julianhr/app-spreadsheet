import React from 'react'
import { render, fireEvent, cleanup } from 'react-testing-library'

import MockApp from '~/__tests__/__mocks__/MockApp'
import ColLabel from '../ColLabel'


const renderApp = (props) => {
  const wrapper = render(
    <MockApp>
      <table>
        <tr>
          <ColLabel {...props} />
        </tr>
      </table>
    </MockApp>
  )

  return wrapper
}

describe('ColLabel', () => {
  afterEach(cleanup)

  it('matches snapshot', () => {
    const props = {
      label: 'A'
    }

    renderApp(props)
    const el = document.querySelector('td')
    expect(el).toMatchSnapshot()
  })
})
