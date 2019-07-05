import graph from '../graph'


describe('graph', () => {
  beforeEach(() => {
    graph.resetAll()
  })

  test('#recalculate', () => {
    graph.addVertex('A-1', '=5+2')
    jest.spyOn(graph, 'setPendingNodes')
    jest.spyOn(graph, 'dfs')
    jest.spyOn(graph, 'updateStore')

    graph.recalculate('A-1')
    expect(graph.setPendingNodes).toHaveBeenCalledTimes(1)
    expect(graph.dfs).toHaveBeenCalledTimes(1)
    expect(graph.updateStore).toHaveBeenCalledTimes(1)
  })

  describe('#getCellResult', () => {
    it('returns value if vertex exists', () => {
      graph.addVertex('A-1', '=5+2')
      expect(graph.getCellResult('A-1')).toBe(7)
    })

    it('returns empty string if vertex does not exist', () => {
      expect(graph.getCellResult('A-1')).toBe('')
    })
  })

  test('#setPendingNodes', () => {
    graph.addVertex('A-1', '=5+2')
    graph.addVertex('A-2', '=A1+3')
    graph.addVertex('B-2', '5')
    graph.setPendingNodes()
    expect(graph.pending).toEqual(new Set(['A-1', 'A-2', 'B-2']))
  })
})
