export default {
  'module': {
    'layersNum': 4,
    'layers': [{
      'lid': 0,
      'nodesNum': 4,
      'nodes': [{
        'nid': 0,
        'group': 0,
        'connections': [0, 1, 2],
        'connectBy': [],
        'cost': [3, 1, 3]
      }, {
        'nid': 1,
        'group': 1,
        'connections': [0, 1, 2],
        'connectBy': [],
        'cost': [3, 1, 3]
      }, {
        'nid': 2,
        'group': 0,
        'connections': [0, 1, 2],
        'connectBy': [],
        'cost': [4, 2, 1]
      }, {
        'nid': 3,
        'group': 2,
        'connections': [0, 1, 2],
        'connectBy': [],
        'cost': [1, 3, 2]
      }]
    }, {
      'lid': 1,
      'nodesNum': 3,
      'nodes': [{
        'nid': 0,
        'group': 0,
        'connections': [0],
        'connectBy': [0, 1, 2, 3],
        'cost': [2, 2, 2]
      }, {
        'nid': 1,
        'group': 2,
        'connections': [0, 1],
        'connectBy': [0, 1, 2, 3],
        'cost': [2, 2, 2]
      }, {
        'nid': 2,
        'group': 2,
        'connections': [1],
        'connectBy': [0, 1, 2, 3],
        'cost': [2, 2, 2]
      }]
    }, {
      'lid': 2,
      'nodesNum': 2,
      'nodes': [{
        'nid': 0,
        'group': 1,
        'connections': [0],
        'connectBy': [0, 1],
        'cost': [1, 3, 6]
      }, {
        'nid': 1,
        'group': 1,
        'connections': [0],
        'connectBy': [1, 2],
        'cost': [4, 4, 2]
      }]
    }, {
      'lid': 3,
      'nodesNum': 1,
      'nodes': [{
        'nid': 0,
        'group': 2,
        'connections': [],
        'connectBy': [0, 1],
        'cost': [2, 2, 2]
      }]
    }]
  }
}
