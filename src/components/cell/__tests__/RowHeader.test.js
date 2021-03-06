import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'

import MockApp from '~/__tests__/__mocks__/MockApp'
import RowHeader from '../RowHeader'


const renderApp = (props) => {
  const wrapper = render(
    <MockApp>
      <table>
        <tr>
          <RowHeader {...props} />
        </tr>
      </table>
    </MockApp>
  )

  return wrapper
}

describe('RowHeader', () => {
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
