import Interpreter from './Interpreter'


const adjList = {
  'A-1': {
    result: null,
    ast: null,
    hasError: false,
    inNodes: new Set(),
  }
}

class Graph {
  constructor(adj, interpreter) {
    this.adj = adj
    this.interpreter = interpreter
  }

  addVertex(vertex, data) {
    this.adj[vertex] = data
  }

  eval(node, source) {
    const cellLabel = node.text
    let result = 0

    if (cellLabel in adjList) {
      const interpreter = new Interpreter(source)
      result = interpreter.interpret(node.cell)
    } else {
      adjList[cellLabel] = this.newNodeAttr()
    }

    adjList[cellLabel].inNodes.add(source)
    return result
  }
  
  dfs() {

  }

  newNodeAttr() {
    return {
      result: null,
      ast: null,
      hasError: false,
      inNodes: new Set()
    }
  }
}

const graph = new Graph(adjList)


export default graph
export {
  Graph,
}
