import ReduxConnect from './ReduxConnect'
import Interpreter from './Interpreter'


class Vertex {
  constructor(entered) {
    this.entered = entered
    this.error = null
    this.result = null
    this.ast = null
  }
}

class Graph {
  constructor() {
    this.adj = {}
    this.pending = null
    this.visited = null
    this.store = new ReduxConnect()
  }

  recalculate(location) {
    this.setPendingNodes()
    this.dfs(location)
    this.updateStore()
  }

  setPendingNodes() {
    this.pending = new Set()

    Object.keys(this.adj).forEach(vertex => {
      this.pending.add(vertex)
    })
  }

  dfs(location) {
    while (this.pending.size > 0) {
      if (!location) {
        location = [...this.pending][0]
      }

      try {
        this.visited = new Set([location])
        const interpreter = new Interpreter(location)
        interpreter.visitAST(location)
      } catch (error) {}

      this.visited.forEach(location => this.pending.delete(location))
      location = null
    }

    this.visited = null
    this.pending = null
  }

  visitCell(location) {
    if (!this.hasVertex(location)) {
      return 0
    }

    this.testPathCycle(location)
    this.pending.delete(location)
    this.visited.add(location)
    const interpreter = new Interpreter(location)
    const result = interpreter.visitAST(location)
    this.visited.delete(location)
    return result
  }

  getCellResult(location) {
    if (location in this.adj) {
      return graph.adj[location].result
    } else {
      return ''
    }
  }

  testPathCycle(location) {
    if (this.visited.has(location)) {
      throw new Error('Circular reference')
    }
  }

  updateStore() {
    const locationKeys = new Set(this.store.locations)

    for (let [location, vertex] of Object.entries(this.adj)) {
      const { entered, result } = vertex

      locationKeys.delete(location)

      if (result !== this.store.getCellResult(location)) {
        this.store.replaceCellData(location, entered, result)
      }
    }

    for (let location of locationKeys) {
      this.store.clearCell(location)
    }
  }

  addVertex(location, entered) {
    const vertex = new Vertex(entered)
    this.adj[location] = vertex
    return vertex
  }

  hasVertex(location) {
    return location in this.adj
  }

  getVertex(location) {
    this.testMissingLocation(location)
    return this.adj[location]
  }

  delVertex(location) {
    if (location in this.adj) {
      delete this.adj[location]
      this.recalculate()
    }
  }

  resetAll() {
    this.adj = {}
    this.pending = null
    this.visited = null
    this.store = new ReduxConnect()
  }

  testMissingLocation(location) {
    if (!this.hasVertex(location)) {
      throw new Error('Missing location')
    }
  }
}

const graph = new Graph()


export default graph
export {
  Vertex,
  Graph,
}
