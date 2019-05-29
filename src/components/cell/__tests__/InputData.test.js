import React from 'react'
import { create } from 'react-test-renderer'
import { render, fireEvent, cleanup, waitForElement } from 'react-testing-library'

import ConnectedInputData, {
  InputData,
  ERR_DIV_BY_ZERO,
  ERR_GENERIC,
} from '../InputData'
import MockApp from '~/__tests__/__mocks__/MockApp'
import appStoreGen from '~/reducers'
import { setCellValue } from '~/actions/tableActions'


const requiredProps = {
  // props
  replaceValue: false,
  location: 'B-2',
  onEscape: jest.fn(),
  onCommit: jest.fn(),
  // redux
  clearCellValue: jest.fn(),
  setCellValue: jest.fn(),
}

const testProps = {
  ...requiredProps,
  // props
  formula: 'test formula',
}

const createApp = (props) => {
  jest.spyOn(InputData.prototype, 'componentDidMount').mockReturnValueOnce('mocked cdm')
  const wrapper = create(<MockApp><InputData {...props} /></MockApp>)
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
      const saved = { location: testProps.location, value: 'test string', formula: 'formula string' }
      await appStore.dispatch(setCellValue(saved))
      expect(appStore.getState().table[saved.location]).toBeTruthy()

      const [wrapper, _] = renderApp(testProps, appStore)
      const input = wrapper.getByDisplayValue(saved.formula)

      input.value = ''
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(appStore.getState().table[saved.location]).toBeUndefined()
    })

    it('saves trimmed value if string is valid', () => {
      const appStore = appStoreGen()
      const saved = { location: testProps.location, value: 'test string', formula: 'formula string' }
      expect(appStore.getState().table[saved.location]).toBeUndefined()

      const [wrapper, _] = renderApp(testProps, appStore)
      const input = wrapper.getByDisplayValue('')
      const value = ' test value\n'

      input.value = value
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(appStore.getState().table[saved.location].formula).toBe(value.trim())
    })

    it('calls #evaluateFormula if value starts with "="', () => {
      const [wrapper, _] = renderApp(testProps)
      const input = wrapper.getByDisplayValue('')
      const formula = '=2+3'

      jest.spyOn(InputData.prototype, 'evaluateFormula')
      input.value = formula
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(InputData.prototype.evaluateFormula).toHaveBeenCalledTimes(1)
    })
  })

  describe('#evaluateFormula', () => {
    it('returns interpreted result if formula is valid', () => {
      const [_, store] = renderApp(testProps)
      const input = document.querySelector('#f-B-2')
      const formula = '=2+3'
      const cellData = { value: 5, formula }

      input.value = formula
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(store.getState().table[testProps.location]).toEqual(cellData)
    })

    it('returns error if dividing by zero', () => {
      const [_, store] = renderApp(testProps)
      const input = document.querySelector('#f-B-2')
      const formula = '=3/0'
      const cellData = { value: ERR_DIV_BY_ZERO, formula }

      input.value = formula
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(store.getState().table[testProps.location]).toEqual(cellData)
    })

    it('returns error if formula cannot be interpreted', () => {
      const [_, store] = renderApp(testProps)
      const input = document.querySelector('#f-B-2')
      const formula = '=3+5)'
      const cellData = { value: ERR_GENERIC, formula }

      input.value = formula
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(store.getState().table[testProps.location]).toEqual(cellData)
    })
  })

  describe('#handleOnKeyDown', () => {
    test('sequence of events if key is "Escape"', () => {
      testProps.onEscape.mockReset()
      const [wrapper, _] = renderApp(testProps)
      const input = wrapper.getByDisplayValue('')
      fireEvent.keyDown(input, { key: 'Escape' })
      expect(testProps.onEscape).toHaveBeenCalledTimes(1)
    })

    test('sequence of event if key is "Enter', () => {
      testProps.onCommit.mockReset()
      const [wrapper, _] = renderApp(testProps)
      const input = wrapper.getByDisplayValue('')
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(testProps.onCommit).toHaveBeenCalledTimes(1)
    })

    test('keydown event does not bubble unless key is "Enter" or "Escape"', () => {
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
      const input = document.querySelector('input')

      events.forEach(key => fireEvent.keyDown(input, { key }))
      expect(spyKeyDown).toHaveBeenCalledTimes(2)
    })
  })

  describe('#handleOnBlur', () => {
    test('stores value and calls #onCommit', () => {
      const [_, store] = renderApp(testProps)
      const formula = 'test value'
      const cellData = { value: formula, formula }

      testProps.onCommit.mockReset()
      const input = document.querySelector('input')
      input.value = formula
      fireEvent.blur(input)

      expect(store.getState().table[testProps.location]).toEqual(cellData)
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
      const cellData = {
        location: funcProps.location,
        value: 'test text',
        formula: 'test formula'
      }
      const store = appStoreGen()
      await store.dispatch(setCellValue(cellData))
      const props = {...funcProps}
      props.replaceValue = false
      const [wrapper, _] = renderApp(props, store)

      expect(wrapper.asFragment()).toMatchSnapshot()
    })

    it('will not display default value if replaceValue is true', async () => {
      const cellData = {
        location: funcProps.location,
        value: 'test text',
        formula: 'test formula'
      }
      const store = appStoreGen()
      await store.dispatch(setCellValue(cellData))
      const props = {...funcProps}
      props.replaceValue = true
      const [wrapper, _] = renderApp(props, store)

      expect(wrapper.asFragment()).toMatchSnapshot()
    })
  })
})
