import React from 'react'
import { create } from 'react-test-renderer'
import { render, fireEvent, cleanup } from 'react-testing-library'
import * as xstate from 'xstate'

import { setCellData } from '~/actions/tableActions'
import { appStoreGen } from '~/reducers'
import MockApp from '~/__tests__/__mocks__/MockApp'
import CellData from '../CellData'


const requiredProps = {
  location: 'B-2',
}

const testProps = {
  ...requiredProps,
}

function createApp(props) {
  const appStore = appStoreGen()
  const wrapper = create(
    <MockApp customStore={appStore}>
      <CellData {...props} />
    </MockApp>
  )
  const instance = wrapper.root.findByType(CellData).instance
  return [wrapper, instance]
}

const renderApp = (props, customStore) => {
  const store = customStore || appStoreGen()
  const wrapper = render(
    <MockApp customStore={store}>
      <CellData {...props} />
    </MockApp>
  )
  return [wrapper, store]
}

describe('CellData', () => {
  afterEach(cleanup)

  describe('props', () => {
    test('location is required', () => {
      const props = {...requiredProps}
      delete props.location
      expect(() => createApp(props)).toThrow()
    })
  })

  describe('#evaluatedOnDoubleClick', () => {
    it('displays input field with current result value result tag is double-clicked', async () => {
      const { location } = testProps
      const entered = '5'
      const store = appStoreGen()
      await store.dispatch(setCellData(location, entered))
      renderApp(testProps, store)
      const resultTag = document.querySelector(`[data-location="${testProps.location}"]`)

      fireEvent.doubleClick(resultTag)
      const inputTag = document.querySelector(
        `[data-cell="input"][data-location="${testProps.location}"]`
        )
      expect(inputTag.value).toEqual(entered)
    })
  })

  describe('#evaluatedOnKeyDownEditable', () => {
    it('displays input field with empty field', async () => {
      const { location } = testProps
      const entered = 'test entered'
      const store = appStoreGen()
      await store.dispatch(setCellData(location, entered))
      renderApp(testProps, store)
      const tag = document.querySelector(`[data-location="${testProps.location}"]`)

      fireEvent.keyDown(tag, { key: 'l' })
      const inputTag = document.querySelector(
        `[data-cell="input"][data-location="${testProps.location}"]`
      )
      expect(inputTag.value).toEqual('')
    })
  })

  describe('#inputTagOnEscape', () => {
    it('dispalys focused text tag when escaping from input tag', () => {
      renderApp(testProps)

      const resultTag = document.querySelector(`[data-location="${testProps.location}"]`)
      fireEvent.doubleClick(resultTag)
      const inputTag = document.querySelector(
        `[data-cell="input"][data-location="${testProps.location}"]`
      )

      expect(document.activeElement).toBe(inputTag)
      fireEvent.keyDown(inputTag, { key: 'Escape' })
      expect(document.activeElement).toEqual(resultTag)
    })
  })

  describe('#inputTagOnCommit', () => {
    it('displays text tag with current text value and is not focused', () => {
      const value = 'test value'
      let resultTag
      renderApp(testProps)

      resultTag = document.querySelector(`[data-location="${testProps.location}"]`)
      fireEvent.doubleClick(resultTag)
      const inputTag = document.querySelector(
        `[data-cell="input"][data-location="${testProps.location}"]`
      )

      inputTag.value = value
      fireEvent.keyDown(inputTag, { key: 'Enter' })
      resultTag = document.querySelector(`[data-location="${testProps.location}"]`)
      expect(resultTag.innerHTML).toEqual(value)
      expect(document.activeElement).not.toBe(resultTag)
    })
  })

  describe('functional tests', () => {
    it('on component mount start state machine interpereter', () => {
      jest.spyOn(xstate.Interpreter.prototype, 'start')
      renderApp(testProps)
      expect(xstate.Interpreter.prototype.start).toHaveBeenCalledTimes(1)
    })

    it('on component unmount stop state machine interpereter', () => {
      jest.spyOn(xstate.Interpreter.prototype, 'stop')
      renderApp(testProps)
      cleanup()
      expect(xstate.Interpreter.prototype.stop).toHaveBeenCalledTimes(1)
    })

    test('lifecycle snapshots', () => {
      let resultTag, inputTag
      const [wrapper, _] = renderApp(testProps)
      expect(wrapper.asFragment()).toMatchSnapshot('1. initial text tag')

      resultTag = document.querySelector(`[data-location="${testProps.location}"]`)
      fireEvent.doubleClick(resultTag)
      expect(wrapper.asFragment()).toMatchSnapshot('2. initial input tag')

      inputTag = document.querySelector(
        `[data-cell="input"][data-location="${testProps.location}"]`
      )
      inputTag.value = '=2+3+4'
      fireEvent.keyDown(inputTag, { key: 'Enter' })
      expect(wrapper.asFragment()).toMatchSnapshot('3. text tag has text')

      resultTag = document.querySelector(`[data-location="${testProps.location}"]`)
      fireEvent.doubleClick(resultTag)
      expect(wrapper.asFragment()).toMatchSnapshot('4. input tag has formula')

      inputTag = document.querySelector(
        `[data-cell="input"][data-location="${testProps.location}"]`
      )
      fireEvent.keyDown(inputTag, { key: 'Escape' })
      resultTag = document.querySelector(`[data-location="${testProps.location}"]`)
      fireEvent.keyDown(resultTag, { key: 'Backspace' })
      expect(wrapper.asFragment()).toMatchSnapshot('5. cell value deleted with Backspace')

      fireEvent.keyDown(resultTag, { key: 'a' })
      inputTag = document.querySelector(
        `[data-cell="input"][data-location="${testProps.location}"]`
      )
      expect(wrapper.asFragment()).toMatchSnapshot('6. key down "a" on text tag')
    })
  })
})
