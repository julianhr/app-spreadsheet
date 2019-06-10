import { interpret } from 'xstate'
import displayMachine from '../displayMachine'


describe('displayMachine', () => {
  let service

  beforeEach(() => {
    service = interpret(displayMachine)
    service.start()
  })

  afterEach(() => {
    service.stop()
  })


  it('initializes at "static.notFocused"', () => {
    expect(service.state.matches('static.notFocused')).toBe(true)
  })

  describe('static state', () => {
    test('static.notFocused -> editable.modify', () => {
      service.send('EDITABLE_MODIFY')
      expect(service.state.matches('editable.modify')).toBe(true)
    })
  
    test('static.notFocused -> editable.replace', () => {
      service.send('EDITABLE_REPLACE')
      expect(service.state.matches('editable.replace')).toBe(true)
    })
  })

  describe('editable state', () => {
    test('editable.replace -> static.focused', () => {
      service.send('EDITABLE_REPLACE')
  
      expect(service.state.matches('editable.replace')).toBe(true)
      service.send('STATIC_FOCUSED')
      expect(service.state.matches('static.focused')).toBe(true)
    })
  
    test('editable.replace -> static.notFocused', () => {
      service.send('EDITABLE_REPLACE')
  
      expect(service.state.matches('editable.replace')).toBe(true)
      service.send('STATIC')
      expect(service.state.matches('static.notFocused')).toBe(true)
    })
  
    test('editable.modify -> static.focused', () => {
      service.send('EDITABLE_MODIFY')
  
      expect(service.state.matches('editable.modify')).toBe(true)
      service.send('STATIC_FOCUSED')
      expect(service.state.matches('static.focused')).toBe(true)
    })
  
    test('editable.modify -> static.notFocused', () => {
      service.send('EDITABLE_MODIFY')
  
      expect(service.state.matches('editable.modify')).toBe(true)
      service.send('STATIC')
      expect(service.state.matches('static.notFocused')).toBe(true)
    })
  })
})
