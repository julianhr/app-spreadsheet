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

  interpret(location, input) {
    const interpreter = new Interpreter(location)
    return interpreter.interpret(input)
  }

  recalculate(initLocation) {
    this.setPendingNodes()
    this.dfs(initLocation)
    this.updateStore()
  }

  getCellResult(location) {
    if (this.hasVertex(location)) {
      return this.getVertex(location).result
    } else {
      return ''
    }
  }

  setPendingNodes() {
    this.pending = new Set()

    Object.keys(this.adj).forEach(vertex => {
      this.pending.add(vertex)
    })
  }

  isResolved(location) {
    return this.isVisited(location) || !this.isPending(location)
  }

  isVisited(location) {
    return this.visited.has(location)
  }

  isPending(location) {
    return this.pending.has(location)
  }

  dfs(location) {
    while (this.pending.size > 0) {
      let interpreter
      this.visited = new Set()

      if (!location) {
        location = [...this.pending][0]
      }

      try {
        interpreter = new Interpreter(location)
        interpreter.visit(location)
      } catch (error) {}

      this.visited.forEach(location => this.pending.delete(location))
      location = null
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

  markVisited(location) {
    return this.visited.add(location)
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
