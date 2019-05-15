import {
  getColumnNames,
  getCellNames,
  getColumnPosition,
  getColumnLabel,
  parseLocation,
  sleep,
} from '../utils'

const columnNames = getColumnNames(800)

describe('#sleep', () => {
  it('awaits on main thread for an amount of milliseconds', async () => {
    const t0 = Date.now()
    await sleep(250)
    const t1 = Date.now()
    const diff = t1 - t0
    expect(diff).toBeGreaterThan(200)
    expect(diff).toBeLessThan(300)
  })
})

describe('#getColumnNames', () => {
  it('returns an array of names', () => {
    expect(columnNames).toMatchSnapshot()
    expect(columnNames.length).toBe(800)
  })
})

describe('#getCellNames', () => {
  it('returns an array of names', () => {
    const columnNames = getCellNames(2, 100)
    expect(columnNames).toMatchSnapshot()
    expect(columnNames.length).toBe(200)
  })
})

describe('#getColumnPosition', () => {
  it('returns position from label', () => {
    for (let i = 0; i < 800; i += 10) {
      const name = columnNames[i]
      expect( getColumnPosition(name) ).toEqual(i)
    }
  })
})

describe('#getColumnLabel', () => {
  it('returns the column name from a position', () => {
    for (let i = 0; i < 800; i += 10) {
      const name = columnNames[i]
      expect( getColumnLabel(i) ).toEqual(name)
    }
  })
})

describe('#parseLocation', () => {
  it('returns an array of row and column as digits', () => {
    const tests = [
      ['t-A-2', 0, 1],
      ['f-Z-5', 25, 4],
      ['t-AA-250', 26, 249],
      ['f-BC-353', 54, 352],
    ]

    tests.forEach(([ location, row, col ]) => {
      const position = parseLocation(location)
      expect(position).toEqual([row, col])
    })
  })
})
