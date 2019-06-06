import React from 'react'
import { create } from 'react-test-renderer'
import { render, fireEvent, cleanup } from 'react-testing-library'
import emotionSerializer from 'jest-emotion'

import ConnectedResultData, { ResultData } from '../ResultData'
import MockApp from '~/__tests__/__mocks__/MockApp'
import { appStoreGen } from '~/reducers'
import { setCellData } from '~/actions/tableActions'


const requiredProps = {
  // props
  location: 'B-2',
  onDoubleClick: jest.fn(),
  onKeyDownEditable: jest.fn(),
  // redux
  clearCellData: jest.fn(),
  setActiveCell: jest.fn(),
  result: 'test result',
}

const testProps = {
  ...requiredProps,
  // props
  isFocused: true,
}

const createApp = (props) => {
  jest.spyOn(ResultData.prototype, 'focusDataTag').mockReturnValueOnce(null)
  const wrapper = create(
    <MockApp>
      <ResultData {...props} />
    </MockApp>
  )

  const cell = wrapper.root.findByType(ResultData).instance
  cell.refDataTag.current = document.createElement('div')
  return wrapper
}

const renderApp = (props, customStore) => {
  const store = customStore || appStoreGen()
  const wrapper = render(
    <MockApp customStore={store}>
      <ConnectedResultData {...props} />
    </MockApp>
  )
  return [wrapper, store]
}

describe('ResultData', () => {
  afterEach(cleanup)

  describe('props', () => {
    test('all required props', () => {
      expect(() => createApp(testProps)).not.toThrow()
    })

    it('raises warning if required props is not present', () => {
      Object.keys(requiredProps).forEach(key => {
        const props = {...testProps}
        delete props[key]
        expect(() => createApp(props)).toThrow()
      })
    })
  })

  describe('#focusDataTag', () => {
    it('if props.isFocused = true then focus text tag on mount', () => {
      const props = {...testProps}
      props.isFocused = true
      renderApp(props)

      const tag = document.querySelector(`[data-location="${props.location}"`)
      expect(document.activeElement).toBe(tag)
    })

    it('if props.isFocused = false then do not focus text tag', () => {
      const props = {...testProps}
      props.isFocused = false
      renderApp(props)

      const tag = document.querySelector(`[data-location="${props.location}"`)
      expect(document.activeElement).not.toBe(tag)
    })
  })

  describe('#handleOnKeyDown', () => {
    it('sets active cell to current one', async () => {
      const store = appStoreGen()
      expect(store.getState().global.activeCell).toBeNull()

      renderApp(testProps, store)
      const tag = document.querySelector(`[data-location="${testProps.location}"]`)
      fireEvent.keyDown(tag, { key: 'a' })
      expect(store.getState().global.activeCell).toEqual(testProps.location)
    })

    it('clears value if key pressed is Backspace or Delete', async () => {
      const store = appStoreGen()
      const { location } = testProps
      const entered = 'test entered'
      const result = entered

      const keys = [
        ['Backspace', false],
        ['Delete', false],
        ['a', true],
        ['1', true],
        [',', true]
      ]
      renderApp(testProps, store)
      const tag = document.querySelector(`[data-location="${testProps.location}"]`)

      for (let [key, expected] of keys) {
        await store.dispatch(setCellData(location, entered, true, result))
        fireEvent.keyDown(tag, { key })
        const hasValue = Boolean(store.getState().table[testProps.location])
        expect(hasValue).toEqual(expected)
      }
    })

    it('calls #onKeyDownEditable if key pressed is printable symbol', () => {
      const keys = [
        ['a', 1],
        ['1', 2],
        [',', 3],
        ['Backspace', 3],
        ['Delete', 3],
      ]
      testProps.onKeyDownEditable.mockReset()
      renderApp(testProps)
      const tag = document.querySelector(`[data-location="${testProps.location}"]`)

      for (let [key, times] of keys) {
        fireEvent.keyDown(tag, { key })
        expect(testProps.onKeyDownEditable).toHaveBeenCalledTimes(times)
      }
    })
  })

  describe('functional tests', () => {
    it('snapshot with value as string', () => {
      expect.addSnapshotSerializer(emotionSerializer)
      render(<MockApp><ResultData {...testProps} /></MockApp>)
      const el = document.querySelector(`[data-location="${testProps.location}"]`)
      expect(el).toMatchSnapshot()
    })

    it('snapshot with value as number', () => {
      expect.addSnapshotSerializer(emotionSerializer)
      const props = {  ...testProps, result: 5 }
      render(<MockApp><ResultData {...props} /></MockApp>)
      const el = document.querySelector(`[data-location="${props.location}"`)
      expect(el).toMatchSnapshot()
    })
  })
})
