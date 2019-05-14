import React from 'react'
import { create } from 'react-test-renderer'
import { render, fireEvent, cleanup } from 'react-testing-library'
import * as xstate from 'xstate'

import { setCellValue } from '~/actions/tableActions'
import appStoreGen from '~/reducers'
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
  const wrapper = create(<MockApp customStore={appStore}><CellData {...props} /></MockApp>)
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

  describe('#textTagOnDoubleClick', () => {
    it('displays input tag with current formula value when text tag is double-clicked', async () => {
      const value = 'test value'
      const cell = { location: testProps.location, text: value, formula: value }
      const store = appStoreGen()
      await store.dispatch(setCellValue(cell))
      renderApp(testProps, store)
      const tag = document.querySelector(`#t-${testProps.location}`)

      fireEvent.doubleClick(tag)
      expect(document.querySelector('input').value).toEqual(value)
    })
  })

  describe('#textTagOnKeyDownEditable', () => {
    it('displays input tag with empty field', async () => {
      const value = 'test value'
      const cell = { location: testProps.location, text: value, formula: value }
      const store = appStoreGen()
      await store.dispatch(setCellValue(cell))
      renderApp(testProps, store)
      const tag = document.querySelector(`#t-${testProps.location}`)

      fireEvent.keyDown(tag, { key: 'l' })
      expect(document.querySelector('input').value).toEqual('')
    })
  })

  describe('#inputTagOnEscape', () => {
    it('dispalys focused text tag when escaping from input tag', () => {
      renderApp(testProps)

      const tag = document.querySelector(`#t-${testProps.location}`)
      fireEvent.doubleClick(tag)
      const input = document.querySelector(`#f-${testProps.location}`)

      expect(document.activeElement).toBe(input)
      fireEvent.keyDown(input, { key: 'Escape' })
      expect(document.activeElement).toEqual(tag)
    })
  })

  describe('#inputTagOnCommit', () => {
    it('displays text tag with current text value and is not focused', () => {
      const value = 'test value'
      let tag
      renderApp(testProps)

      tag = document.querySelector(`#t-${testProps.location}`)
      fireEvent.doubleClick(tag)
      const input = document.querySelector(`#f-${testProps.location}`)

      input.value = value
      fireEvent.keyDown(input, { key: 'Enter' })
      tag = document.querySelector(`#t-${testProps.location}`)
      expect(tag.innerHTML).toEqual(value)
      expect(document.activeElement).not.toBe(tag)
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

    it('matches snapshot during lifecycle', () => {
      let tag, input
      const [wrapper, _] = renderApp(testProps)
      expect(wrapper.asFragment()).toMatchSnapshot('Initial text tag')

      tag = document.querySelector(`#t-${testProps.location}`)
      fireEvent.doubleClick(tag)
      expect(wrapper.asFragment()).toMatchSnapshot('Initial input tag')

      input = document.querySelector(`#f-${testProps.location}`)
      input.value = '=2+3+4'
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(wrapper.asFragment()).toMatchSnapshot('Text tag has text')

      tag = document.querySelector(`#t-${testProps.location}`)
      fireEvent.doubleClick(tag)
      expect(wrapper.asFragment()).toMatchSnapshot('Input tag has formula')
    })
  })
})
