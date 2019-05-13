import React from 'react'
import { create } from 'react-test-renderer'
import { render, fireEvent, cleanup, waitForElement } from 'react-testing-library'
import { connect } from 'react-redux'

import InputDataConnected, { InputData } from '../InputData'
import MockApp from '~/__tests__/__mocks__/MockApp'
import appStoreGen from '~/reducers'
import { setCellValue } from '~/actions/tableActions'


const testProps = {
    // props
    replaceValue: true,
    location: 'B-2',
    onEscape: jest.fn(),
    onCommit: jest.fn(),
    // redux
    clearCellValue: jest.fn(),
    formula: 'test formula',
    setCellValue: jest.fn(),
}

const createApp = (props) => {
  jest.spyOn(InputData.prototype, 'componentDidMount').mockReturnValueOnce('mocked cdm')
  const wrapper = create(<MockApp><InputData {...props} /></MockApp>)
  const { instance } = wrapper.root.findByType(InputData)
  return [wrapper, instance]
}

const renderApp = (props) => {
  const appStore = appStoreGen()
  const wrapper = render(<MockApp customStore={appStore}><InputDataConnected {...props} /></MockApp>)
  return [wrapper, appStore]
}

describe('InputData', () => {
  afterEach(cleanup)

  describe('props', () => {
    it('does not raise warning if al required props are passed', () => {
      expect(() => createApp(testProps)).not.toThrow()
    })

    test('replaceValue is required', () => {
      const props = {...testProps}
      delete props.replaceValue
      expect(() => createApp(props)).toThrow()
    })

    test('location is required', () => {
      const props = {...testProps}
      delete props.location
      expect(() => createApp(props)).toThrow()
    })

    test('onEscape is required', () => {
      const props = {...testProps}
      delete props.onEscape
      expect(() => createApp(props)).toThrow()
    })

    test('onCommit is required', () => {
      const props = {...testProps}
      delete props.onCommit
      expect(() => createApp(props)).toThrow()
    })

    test('clearCellValue is required', () => {
      const props = {...testProps}
      delete props.clearCellValue
      expect(() => createApp(props)).toThrow()
    })

    test('setCellValue is required', () => {
      const props = {...testProps}
      delete props.setCellValue
      expect(() => createApp(props)).toThrow()
    })
  })

  describe('#focusInputTag', () => {
    it('focuses text tag and places cursor at far-right', () => {
      const mockRef = { focus: jest.fn(), scrollLeft: 0, scrollWidth: 25 }
      const [_, instance] = createApp(testProps)
      instance.refInput.current = mockRef
  
      instance.focusInputTag()
      expect(instance.refInput.current.focus).toHaveBeenCalledTimes(1)
      expect(instance.refInput.current.scrollLeft).toEqual(mockRef.scrollWidth)
    })
  })

  describe('#setNewValue', () => {
    it('if string is empty the current value is deleted', () => {
      const value = ''
      testProps.clearCellValue.mockReset()
      testProps.setCellValue.mockReset()
      const [_, instance] = createApp(testProps)

      instance.setNewValue(value)
      expect(testProps.clearCellValue).toHaveBeenCalledTimes(1)
      expect(testProps.setCellValue).toHaveBeenCalledTimes(0)
    })

    it('saves trimmed value if string is valid', () => {
      const value = ' this is valid but not trimmed\n'
      const saved = { location: testProps.location, text: value.trim(), formula: value.trim() }
      testProps.clearCellValue.mockReset()
      testProps.setCellValue.mockReset()
      const [_, instance] = createApp(testProps)

      instance.setNewValue(value)
      expect(testProps.clearCellValue).toHaveBeenCalledTimes(0)
      expect(testProps.setCellValue).toHaveBeenCalledTimes(1)
      expect(testProps.setCellValue.mock.calls[0][0]).toEqual(saved)
    })

    it('calls formula evaluator if value starts with "="', () => {
      const [_, instance] = createApp(testProps)
      jest.spyOn(instance, 'evaluateFormula')

      instance.setNewValue('=2+2')
      expect(instance.evaluateFormula).toHaveBeenCalledTimes(1)

      instance.setNewValue('regular string')
      expect(instance.evaluateFormula).toHaveBeenCalledTimes(1)
    })
  })

  xdescribe('#evaluateFormula', () => {
  })

  describe('#handleOnKeyDown', () => {
    test('sequence of events if key is "Escape"', () => {
      testProps.onEscape.mockReset()
      const [_, instance] = createApp(testProps)
      const event = { key: 'Escape' }
      instance.handleOnKeyDown(event)
      expect(testProps.onEscape).toHaveBeenCalledTimes(1)
    })

    test('sequence of event if key is "Enter', () => {
      testProps.onCommit.mockReset()
      const [_, instance] = createApp(testProps)
      const event = { key: 'Enter', target: { value: 'test value' } }
      jest.spyOn(instance, 'setNewValue')

      instance.handleOnKeyDown(event)
      expect(testProps.onCommit).toHaveBeenCalledTimes(1)
      expect(instance.setNewValue).toHaveBeenCalledTimes(1)
    })

    test('sequence of events if key is not "Enter" or "Escape"', () => {
      const [_, instance] = createApp(testProps)
      let event = { stopPropagation: jest.fn() }
      const events = [['b', 1], ['2', 2], [',', 3]]

      for (let [key, count] of events) {
        event.key = key
        instance.handleOnKeyDown(event)
        expect(event.stopPropagation).toHaveBeenCalledTimes(count)
      }
    })
  })

  describe('#handleOnBlur', () => {
    test('sequence of events', () => {
      let event = { target: { value: 'test value' } }
      const [_, instance] = createApp(testProps)
      jest.spyOn(instance, 'setNewValue').mockReturnValue('mocked setNewValue')
      testProps.onCommit.mockReset()

      instance.handleOnBlur(event)
      expect(instance.setNewValue).toHaveBeenCalledTimes(1)
      expect(testProps.onCommit).toHaveBeenCalledTimes(1)
    })
  })

  describe('functional tests', () => {
    const funcProps = {
      // props
      replaceValue: true,
      location: 'B-2',
      onEscape: jest.fn(),
      onCommit: jest.fn(),
    }

    test('#componentDidMount sequence', () => {
      jest.spyOn(InputData.prototype, 'focusInputTag').mockReturnValue('mock cdm')
      renderApp(funcProps)
      expect(InputData.prototype.focusInputTag).toHaveBeenCalledTimes(1)
    })

    it('displays default value if replaceValue is false', () => {
      const props = {...funcProps}
      props.replaceValue = false
      const [wrapper, appStore] = renderApp(props)
      const value = {
        location: funcProps.location,
        text: 'test text',
        formula: 'test formula'
      }
      appStore.dispatch(setCellValue(value))
      expect(wrapper.asFragment()).toMatchSnapshot()
    })

    it('will not display default value if replaceValue is true', () => {
      const props = {...funcProps}
      props.replaceValue = true
      const [wrapper, appStore] = renderApp(props)
      const value = {
        location: funcProps.location,
        text: 'test text',
        formula: 'test formula'
      }
      appStore.dispatch(setCellValue(value))
      expect(wrapper.asFragment()).toMatchSnapshot()
    })
  })
})
