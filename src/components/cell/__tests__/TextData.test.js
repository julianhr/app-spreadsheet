import React from 'react'
import { create } from 'react-test-renderer'

import { TextData } from '../TextData'
import MockApp from '~/__tests__/__mocks__/MockApp'


const testProps = {
  // props
  isFocused: true,
  location: 'B-2',
  onDoubleClick: jest.fn(),
  onKeyDownEditable: jest.fn(),
  // redux
  clearCellValue: jest.fn(),
  setActiveCell: jest.fn(),
  text: 'test string',
}

const createApp = (props) => {
  jest.spyOn(TextData.prototype, 'focusTextTag').mockReturnValueOnce(null)
  const wrapper = create(<MockApp><TextData {...props} /></MockApp>)

  const cell = wrapper.root.findByType(TextData).instance
  cell.refText.current = document.createElement('div')
  return wrapper
}

describe('TextData', () => {
  describe('props', () => {
    test('all required props', () => {
      expect(() => createApp(testProps)).not.toThrow()
    })

    test('isFocused not required', () => {
      const props = {...testProps}
      delete props.isFocused
      expect(() => createApp(props)).not.toThrow()
    })

    test('location is required', () => {
      const props = {...testProps}
      delete props.location
      expect(() => createApp(props)).toThrow()
    })

    test('onDoubleClick is required', () => {
      const props = {...testProps}
      delete props.onDoubleClick
      expect(() => createApp(props)).toThrow()
    })

    test('onKeyDownEditable is required', () => {
      const props = {...testProps}
      delete props.onKeyDownEditable
      expect(() => createApp(props)).toThrow()
    })
  })

  describe('#focusTextTag', () => {
    it('if props.isFocused = true then focus text tag', () => {
      const props = {...testProps}
      props.isFocused = true
      const wrapper = createApp(props)
      const cell = wrapper.root.findByType(TextData).instance

      cell.refText.current = { focus: jest.fn() }
      cell.focusTextTag()
      expect(cell.refText.current.focus).toHaveBeenCalledTimes(1)
    })

    it('if props.isFocused = false then do not focus text tag', () => {
      const props = {...testProps}
      props.isFocused = false
      const wrapper = createApp(props)
      const cell = wrapper.root.findByType(TextData).instance

      cell.refText.current = { focus: jest.fn() }
      cell.focusTextTag()
      expect(cell.refText.current.focus).not.toHaveBeenCalled()
    })
  })

  describe('#handleOnKeyDown', () => {
    it('calls #setActiveCell', () => {
      const wrapper = createApp(testProps)
      const cell = wrapper.root.findByType(TextData).instance
      cell.handleOnKeyDown({ key: 'a' })
      expect(testProps.setActiveCell).toHaveBeenCalledTimes(1)
    })

    it('calls #clearCellValue if key pressed is Backspace or Delete', () => {
      const wrapper = createApp(testProps)
      const cell = wrapper.root.findByType(TextData).instance
      const keys = [
        ['Backspace', 1],
        ['Delete', 2],
        ['a', 2],
        ['1', 2],
        [',', 2]
      ]

      for (let [key, times] of keys) {
        cell.handleOnKeyDown({ key })
        expect(testProps.clearCellValue).toHaveBeenCalledTimes(times)
      }
    })

    it('calls #onKeyDownEditable if key pressed is printable symbol', () => {
      const wrapper = createApp(testProps)
      const cell = wrapper.root.findByType(TextData).instance
      const keys = [
        ['a', 1],
        ['1', 2],
        [',', 3],
        ['Backspace', 3],
        ['Delete', 3],
      ]

      for (let [key, times] of keys) {
        cell.handleOnKeyDown({ key })
        expect(testProps.onKeyDownEditable).toHaveBeenCalledTimes(times)
      }
    })
  })

  describe('functional tests', () => {
    it('calls #focusTextTag on mount', () => {
      const wrapper = createApp(testProps)
      const cell = wrapper.root.findByType(TextData).instance
      expect(cell.focusTextTag).toHaveBeenCalledTimes(1)
    })

    it('matches snapshot', () => {
      const wrapper = createApp(testProps)
      expect(wrapper).toMatchSnapshot()
    })
  })
})
