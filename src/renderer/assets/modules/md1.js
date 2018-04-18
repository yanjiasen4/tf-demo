export default {
  'module': {
    'layersNum': 3,
    'layers': [{
      'lid': 0,
      'nodesNum': 4,
      'nodes': [{
        'nid': 0,
        'group': 1,
        'connections': [0, 1, 2]
      }, {
        'nid': 1,
        'group': 2,
        'connections': [0, 1, 2]
      }, {
        'nid': 2,
        'group': 1,
        'connections': [0, 1, 2]
      }, {
        'nid': 3,
        'group': 3,
        'connections': [0, 1, 2]
      }]
    }, {
      'lid': 1,
      'nodesNum': 3,
      'nodes': [{
        'nid': 0,
        'group': 1,
        'connections': [0]
      }, {
        'nid': 1,
        'group': 3,
        'connections': [0]
      }, {
        'nid': 2,
        'group': 3,
        'connections': [0]
      }]
    }, {
      'lid': 2,
      'nodesNum': 1,
      'nodes': [{
        'nid': 0,
        'group': 2,
        'connections': []
      }]
    }]
  }
}
