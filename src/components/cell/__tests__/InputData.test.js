import React from 'react'
import { create } from 'react-test-renderer'
import { render, fireEvent, cleanup } from '@testing-library/react'

import ConnectedInputData, { InputData } from '../InputData'
import MockApp from '~/__tests__/__mocks__/MockApp'
import { appStoreGen } from '~/reducers'
import { setCellData } from '~/actions/tableDataActions'
import {
  ERR_DIVISION_BY_ZERO,
  ERR_CIRCULAR_REFERENCE,
  ERR_GENERIC,
} from '~/formulas/Interpreter'


const requiredProps = {
  // props
  replaceValue: false,
  location: 'B-2',
  onEscape: jest.fn(),
  onCommit: jest.fn(),
  // redux
  clearCellData: jest.fn(),
  setCellData: jest.fn(),
}

const testProps = {
  ...requiredProps,
  // props
  entered: 'test entered',
}

const createApp = (props) => {
  jest.spyOn(InputData.prototype, 'componentDidMount').mockReturnValueOnce('mocked cdm')
  const wrapper = create(
    <MockApp>
      <InputData {...props} />
    </MockApp>
  )
  const { instance } = wrapper.root.findByType(InputData)
  return [wrapper, instance]
}

const renderApp = (props, customStore) => {
  const store = customStore || appStoreGen()
  const wrapper = render(
    <MockApp customStore={store}>
      <ConnectedInputData {...props} />
    </MockApp>
  )
  return [wrapper, store]
}

describe('InputData', () => {
  afterEach(cleanup)

  describe('props', () => {
    it('does not raise warning if al required props are passed', () => {
      expect(() => createApp(requiredProps)).not.toThrow()
    })

    it('raises warning if required props is not present', () => {
      Object.keys(requiredProps).forEach(key => {
        const props = {...testProps}
        delete props[key]
        expect(() => createApp(props)).toThrow()
      })
    })
  })

  describe('#focusInputTag', () => {
    it('focuses input tag when component mounts', () => {
      const [wrapper, _] = renderApp(testProps)
      const input = wrapper.getByDisplayValue('')
      expect(document.activeElement).toBe(input)
    })

    it('places cursor on far-right of formula string', async () => {
      const mockRef = { focus: jest.fn(), scrollLeft: 0, scrollWidth: 25 }
      const [_, instance] = createApp(testProps)
      instance.refInput.current = mockRef
  
      instance.focusInputTag()
      expect(instance.refInput.current.focus).toHaveBeenCalledTimes(1)
      expect(instance.refInput.current.scrollLeft).toEqual(mockRef.scrollWidth)
    })
  })

  describe('#setNewValue', () => {
    it('if string is empty the current value is deleted', async () => {
      const appStore = appStoreGen()
      const location = testProps.location
      const isEnteredValid = true
      let entered, result

      entered = 'test string'
      result = entered
      await appStore.dispatch(setCellData(location, entered, isEnteredValid, result))
      expect(appStore.getState().tableData[location]).toBeTruthy()

      renderApp(testProps, appStore)
      const input = document.querySelector(`[data-location="${location}"]`)
      input.value = ''
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(appStore.getState().tableData[location]).toBeUndefined()
    })
  })

  describe('#handleOnKeyDown', () => {
    test('sequence of events if key is "Escape"', () => {
      testProps.onEscape.mockReset()
      renderApp(testProps)
      const input = document.querySelector('[data-cell="input"]')
      fireEvent.keyDown(input, { key: 'Escape' })
      expect(testProps.onEscape).toHaveBeenCalledTimes(1)
    })

    test('sequence of event if key is "Enter', () => {
      testProps.onCommit.mockReset()
      renderApp(testProps)
      const input = document.querySelector('[data-cell="input"]')
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(testProps.onCommit).toHaveBeenCalledTimes(1)
    })

    describe('bubbling', () => {
      describe('Function suggestions not displayed', () => {
        test('only if key is "Enter" or "Escape"', () => {
          const events = 'b Enter 2 , t Escape E s 5'.split(' ')
          const spyKeyDown = jest.fn()
          const Listener = ({ children }) => <div onKeyDown={spyKeyDown}>{children}</div>
          render(
            <MockApp>
              <Listener>
                <InputData {...testProps}  />
              </Listener>
            </MockApp>
          )
          const input = document.querySelector('[data-cell="input"]')
    
          events.forEach(key => fireEvent.keyDown(input, { key }))
          expect(spyKeyDown).toHaveBeenCalledTimes(2)
        })
      })
    })

    describe('Function suggestions is displayed', () => {
      xtest('only if key is "Enter" or "Escape"', () => {
        const events = 'b Enter 2 , t Escape E s 5'.split(' ')
        const spyKeyDown = jest.fn()
        const Listener = ({ children }) => <div onKeyDown={spyKeyDown}>{children}</div>
        render(
          <MockApp>
            <Listener>
              <InputData {...testProps}  />
            </Listener>
          </MockApp>
        )
        const input = document.querySelector('[data-cell="input"]')
        fireEvent.keyDown(input, { key: '=' })
        fireEvent.keyDown(input, { key: 's' })
  
        events.forEach(key => fireEvent.keyDown(input, { key }))
        expect(spyKeyDown).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('#handleOnBlur', () => {
    test('stores value and calls #onCommit', () => {
      const [_, store] = renderApp(testProps)
      const entered = 'test value'
      const cellData = { entered, result: entered }

      testProps.onCommit.mockReset()
      const input = document.querySelector('[data-cell="input"]')
      input.value = entered
      fireEvent.blur(input)

      expect(store.getState().tableData[testProps.location]).toEqual(cellData)
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

    it('displays default value if replaceValue is false', async () => {
      const { location } = testProps
      const entered = 'test entered'
      const result = 'test result'
      const store = appStoreGen()
      await store.dispatch(setCellData(location, entered, true, result))
      const props = {...funcProps}
      props.replaceValue = false
      renderApp(props, store)
      const el = document.querySelector(`[data-location="${location}"]`)

      expect(el).toMatchSnapshot()
    })

    it('will not display default value if replaceValue is true', async () => {
      const { location } = testProps
      const entered = 'test entered'
      const result = 'test result'
      const store = appStoreGen()
      await store.dispatch(setCellData(location, entered, true, result))
      const props = {...funcProps}
      props.replaceValue = true
      renderApp(props, store)
      const el = document.querySelector(`[data-location="${location}"]`)

      expect(el).toMatchSnapshot()
    })
  })
})
