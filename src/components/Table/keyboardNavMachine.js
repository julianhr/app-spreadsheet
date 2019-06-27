import { Machine, assign } from 'xstate'

import { parseLocation, getColumnLabel } from '~/library/utils'


function getTargetLocation({ rows, columns, rowIndex, colIndex, keyEvent }) {
  const { key, altKey, ctrlKey, shiftKey } = keyEvent // eslint-disable-line

  if (key === 'ArrowUp') {
    rowIndex = Math.max(0, rowIndex - 1)
  } else if (key === 'ArrowRight' || (key === 'Tab' && !shiftKey)) {
    colIndex = Math.min(columns - 1, colIndex + 1)
  } else if (['ArrowDown', 'Enter'].includes(key)) {
    rowIndex = Math.min(rows - 1, rowIndex + 1)
  } else if (key === 'ArrowLeft' || (key === 'Tab' && shiftKey)) {
    colIndex = Math.max(0, colIndex - 1)
  } else {
    return null
  }

  const colLabel = getColumnLabel(colIndex)
  const rowLabel = '' + (rowIndex + 1)

  return `${colLabel}-${rowLabel}`
}

function focusTargetCell(ctx) {
  if (!ctx.endLocation) { return Promise.resolve(false) }

  return new Promise(resolve => {
    setTimeout(() => {
      const id = `[data-location="${ctx.endLocation}"]`
      const cell = document.querySelector(id)
      if (cell) { cell.focus() }
      resolve(true)
    }, 0)
  })
}

const state = {
  id: 'keyboardNav',
  initial: 'idle',
  context: {
    columns: null,
    rows: null,
    keyEvent: null,
    colIndex: null,
    rowIndex: null,
    endLocation: null,
    wasFocused: false,
  },
  states: {
    idle: {
      on: {
        'MOVE_FOCUS': {
          actions: ['setNewContext', 'calcTargetLocation'],
          target: 'focusTarget',
        }
      }
    },
    focusTarget: {
      invoke: {
        src: focusTargetCell,
        onDone: {
          actions: assign({ wasFocused: (ctx, event) => event.data }),
          target: 'idle',
        },
      },
    },
  },
}

const actions = {
  actions: {
    setNewContext: assign((ctx, { keyEvent, location }) => {
      const [colIndex, rowIndex] = parseLocation(location)
      return { colIndex, rowIndex, keyEvent }
    }),
    calcTargetLocation: assign({
      endLocation: (ctx) => {
        return getTargetLocation(ctx)
      }
    }),
  },
}

function getKeyboardNavMachine(rows, columns) {
  const newContext = {
    ...state.context,
    columns,
    rows,
  }

  return Machine(state, actions, newContext)
}

export {
  state,
  actions,
  getTargetLocation,
  focusTargetCell,
}

export default getKeyboardNavMachine
