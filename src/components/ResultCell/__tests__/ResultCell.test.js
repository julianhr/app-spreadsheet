import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'

import MockApp from '~/__tests__/__mocks__/MockApp'
import { appStoreGen } from '~/reducers/'
import ResultCell from '../ResultCell'
import { sleep } from '~/library/utils'


const requiredProps = {
  location: 'A-3',
}

const testProps = {
  ...requiredProps,
}

const renderApp = (props) => {
  return render(
    <MockApp>
      <ResultCell {...props} />
    </MockApp>
  )
}

describe('ResultCell', () => {
  afterEach(cleanup)

  test('required props', () => {
    Object.keys(requiredProps).forEach(prop => {
      const props = { ...requiredProps }
      delete props[prop]
      expect(() => renderApp(props)).toThrow()
    })
  })

  describe('#handleOnClick', () => {
    it('calls #focusDatum', () => {
      renderApp(testProps)
      const borderEl = document.querySelector('[data-cell="border"]')

      jest.spyOn(ResultCell.prototype, 'focusDatum')
      fireEvent.click(borderEl)
      expect(ResultCell.prototype.focusDatum).toHaveBeenCalledTimes(1)
    })
  })

  describe('#handleOnDoubleClick', () => {
    it('calls #focusDatum', () => {
      renderApp(testProps)
      const borderEl = document.querySelector('[data-cell="border"]')

      jest.spyOn(ResultCell.prototype, 'focusDatum')
      fireEvent.doubleClick(borderEl)
      expect(ResultCell.prototype.focusDatum).toHaveBeenCalledTimes(1)
    })
  })
})
