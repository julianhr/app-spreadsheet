import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'

import { appStoreGen } from '~/reducers/'
import MockApp from '~/__tests__/__mocks__/MockApp'
import ReduxResult, { Result } from '../Result'


const requiredProps = {
  location: 'A-3',
  fwdRef: React.createRef(),
  // redux
  openFloatingInputter: jest.fn(),
  clearCellData: jest.fn(),
  setActiveCell: jest.fn(),
  result: 5,
  isActive: true,
}

const testProps = {
  ...requiredProps,
}

const renderApp = (props, customStore) => {
  const store = customStore || appStoreGen()
  const wrapper = render(
    <MockApp customStore={store}>
      <Result {...props} />
    </MockApp>
  )

  return [wrapper, store]
}

describe('Result', () => {
  afterEach(cleanup)

  const selector = '[data-cell="result"]'

  test('required props', () => {
    Object.keys(requiredProps).forEach(prop => {
      const props = { ...requiredProps }
      delete props[prop]
      expect(() => renderApp(props)).toThrow()
    })
  })

  describe('#openFloatingInputter', () => {
    test('matches signature', () => {
      renderApp(testProps)
      const el = document.querySelector(selector)
      jest.spyOn(testProps, 'openFloatingInputter')
      fireEvent.doubleClick(el)
      expect(testProps.openFloatingInputter.mock.calls).toMatchSnapshot()
    })
  })

  describe('#handleOnFocus', () => {
    test('calls #setActiveCell', () => {
      renderApp(testProps)
      const el = document.querySelector(selector)
      jest.spyOn(testProps, 'setActiveCell')
      fireEvent.focus(el)
      expect(testProps.setActiveCell).toHaveBeenCalledWith(testProps.location)
    })
  })

  describe('#handleOnClick', () => {
    test('stops event propagation', () => {
      const spyOnClick = jest.fn()
      const ListenClick = ({ children }) => (<div onClick={spyOnClick}>{children}</div>)
      render(
        <MockApp>
          <ListenClick>
            <Result {...testProps} />
          </ListenClick>
        </MockApp>
      )
      const el = document.querySelector(selector)
      jest.spyOn(testProps, 'setActiveCell')
      fireEvent.click(el)
      expect(spyOnClick).not.toHaveBeenCalled()
    })
  })

  describe('#handleOnDoubleClick', () => {
    test('calls #openFloatingInputter', () => {
      renderApp(testProps)
      const el = document.querySelector(selector)
      jest.spyOn(Result.prototype, 'openFloatingInputter')
      fireEvent.doubleClick(el)
      expect(Result.prototype.openFloatingInputter).toHaveBeenCalledWith(false)
    })

    test('stops event propagation', () => {
      const spyOnDoubleClick = jest.fn()
      const ListenClick = ({ children }) => (
        <div onCDoublelick={spyOnDoubleClick}>{children}</div>
      )
      render(
        <MockApp>
          <ListenClick>
            <Result {...testProps} />
          </ListenClick>
        </MockApp>
      )
      const el = document.querySelector(selector)
      jest.spyOn(testProps, 'setActiveCell')
      fireEvent.doubleClick(el)
      expect(spyOnDoubleClick).not.toHaveBeenCalled()
    })
  })

  describe('#handleOnKeyDown', () => {
    it('calls #clearCellData if key pressed is Backspace or Delete', () => {
      renderApp(testProps)
      const el = document.querySelector(selector)
      jest.spyOn(testProps, 'clearCellData')

      fireEvent.keyDown(el, { key: 'Backspace' })
      expect(testProps.clearCellData).toHaveBeenCalledTimes(1)
      expect(testProps.clearCellData).toHaveBeenCalledWith(testProps.location)
      
      fireEvent.keyDown(el, { key: 'Delete' })
      expect(testProps.clearCellData).toHaveBeenCalledTimes(2)
      expect(testProps.clearCellData).toHaveBeenCalledWith(testProps.location)
    })

    it('calls #openFloatingInputter if key pressed is a character', () => {
      renderApp(testProps)
      const el = document.querySelector(selector)
      jest.spyOn(Result.prototype, 'openFloatingInputter')

      fireEvent.keyDown(el, { key: 'a' })
      expect(Result.prototype.openFloatingInputter).toHaveBeenCalledWith(true)
    })
  })

  describe('functional tests', () => {
    it('matches snapshot with Redux', () => {
      const wrapper = render(
        <MockApp>
          <ReduxResult {...testProps} />
        </MockApp>
      )
      expect(wrapper.asFragment()).toMatchSnapshot()
    })
  })
})
