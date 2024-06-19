import React from "react";
import { GraphView } from "react-digraph";

const NODE_KEY = "id";

const GraphConfig = {
  NodeTypes: {
  
    node: {
      typeText: "node",
      shapeId: "#button",
      shape: (
        <symbol viewBox="0 0 100 100" id="button" key="0">
          <text x="20" y="23" textAnchor="middle" fontSize="10"></text>
          <circle cx="50" cy="50" r="45"  />
        </symbol>
      )
    }
 
  },
  NodeSubtypes: {},
  EdgeTypes: {
    emptyEdge: {
      shapeId: "#emptyEdge",
      shape: <span id="emptyEdge" />
    }
  }
};

export default class Graph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      graph: {
        nodes: [
          { id: "1", title: "???", type: "node", x: -200, y: 200 },
          { id: "2", title: "Advice", type: "node", x: 0, y: 300 },
          { id: "3", title: "Help", type: "node", x: 0, y: 100 },
          { id: "4", title: "To chat!", type: "node", x: 200, y: 200 },
          { id: "5", title: "lol!", type: "node", x: 200, y: 200 }
        ],
        edges: [
          { source: "1", target: "2", type: "empty" },
          { source: "2", target: "4", type: "empty" },
          { source: "1", target: "3", type: "empty" },
          { source: "3", target: "4", type: "empty" },
          { source: "", target: "4", type: "empty" }
        ]
      },
      selected: null
    };
  }

  render() {
    const nodes = this.state.graph.nodes;
    const edges = this.state.graph.edges;
    const selected = this.state.selected;

    return (
      <div>
        <div id="graph">
          <GraphView
            ref="GraphView"
            nodeKey={NODE_KEY}
            nodes={nodes}
            edges={edges}
            selected={selected}
            nodeTypes={GraphConfig.NodeTypes}
            nodeSubtypes={GraphConfig.NodeSubtypes}
            edgeTypes={GraphConfig.EdgeTypes}
          />
        </div>
      </div>
    );
  }
}
