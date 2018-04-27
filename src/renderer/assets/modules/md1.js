export default {
  'module': {
    'layersNum': 3,
    'layers': [{
      'lid': 0,
      'nodesNum': 4,
      'nodes': [{
        'nid': 0,
        'group': 1,
        'connections': [0, 2],
        'connectBy': [],
        'cost': [2, 2, 3],
        'time': [2, 2, 3]
      }, {
        'nid': 1,
        'group': 0,
        'connections': [1, 2],
        'connectBy': [],
        'cost': [3, 1, 3],
        'time': [3, 1, 3]
      }, {
        'nid': 2,
        'group': 0,
        'connections': [0, 1],
        'connectBy': [],
        'cost': [4, 2, 1],
        'time': [4, 2, 1]
      }, {
        'nid': 3,
        'group': 2,
        'connections': [0, 1, 2],
        'connectBy': [],
        'cost': [1, 2, 1],
        'time': [1, 2, 1]
      }]
    }, {
      'lid': 1,
      'nodesNum': 3,
      'nodes': [{
        'nid': 0,
        'group': 0,
        'connections': [0],
        'connectBy': [0, 2, 3],
        'cost': [2, 2, 2],
        'time': [2, 2, 2]
      }, {
        'nid': 1,
        'group': 1,
        'connections': [0],
        'connectBy': [1, 2, 3],
        'cost': [1, 2, 1],
        'time': [1, 2, 1]
      }, {
        'nid': 2,
        'group': 2,
        'connections': [0],
        'connectBy': [0, 1, 3],
        'cost': [3, 2, 3],
        'time': [3, 2, 3]
      }]
    }, {
      'lid': 2,
      'nodesNum': 1,
      'nodes': [{
        'nid': 0,
        'group': 1,
        'connections': [],
        'connectBy': [0, 1, 2],
        'cost': [1, 1, 6],
        'time': [1, 1, 6]
      }]
    }]
  }
}
