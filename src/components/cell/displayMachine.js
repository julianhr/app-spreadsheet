import { Machine } from 'xstate'


const displayMachine = Machine({
  id: 'cell',
  initial: 'static',
  states: {
    static: {
      initial: 'notFocused',
      states: {
        focused: {},
        notFocused: {}
      },
      on: {
        EDITABLE_MODIFY: {
          target: 'editable.modify'
        },
        EDITABLE_REPLACE: {
          target: 'editable.replace'
        },
      },
    },
    editable: {
      states: {
        modify: {},
        replace: {},
      },
      on: {
        STATIC_FOCUSED: {
          target: 'static.focused'
        },
        STATIC: {
          target: 'static'
        },
      },
    },
  }
})

export default displayMachine
