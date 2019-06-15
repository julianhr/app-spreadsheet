import { clamp } from '~/library/utils'
import {
  MIN_COL_WIDTH,
  MAX_COL_WIDTH,
} from '~/library/constants'


export function setColWidthDelta(colLabel, width) {
  if (typeof width !== 'number') {
    throw new Error('width is not a number')
  }

  return {
    type: 'SET_COL_WIDTH',
    payload: { colLabel, width: clamp(width, MIN_COL_WIDTH, MAX_COL_WIDTH) }
  }
}