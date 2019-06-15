import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'

import MockApp from '~/__tests__/__mocks__/MockApp'
import ColHeader from '../ColHeader'


const renderApp = (props) => {
  const wrapper = render(
    <MockApp>
      <table>
        <tr>
          <ColHeader {...props} />
        </tr>
      </table>
    </MockApp>
  )

  return wrapper
}

describe('ColHeader', () => {
  afterEach(cleanup)

  it('matches snapshot', () => {
    const props = {
      label: 'A'
    }

    renderApp(props)
    const el = document.querySelector('[data-col="A"]')
    expect(el).toMatchSnapshot()
  })
})
