export default {
  'module': {
    'layersNum': 3,
    'layers': [{
      'lid': 1,
      'nodesNum': 4,
      'nodes': [{
        'nid': 1,
        'group': 1,
        'connections': [1, 2, 3]
      }, {
        'nid': 2,
        'group': 2,
        'connections': [1, 2, 3]
      }, {
        'nid': 3,
        'group': 1,
        'connections': [1, 2, 3]
      }, {
        'nid': 4,
        'group': 3,
        'connections': [1, 2, 3]
      }]
    }, {
      'lid': 2,
      'nodesNum': 3,
      'nodes': [{
        'nid': 1,
        'group': 1,
        'connections': [1]
      }, {
        'nid': 2,
        'group': 3,
        'connections': [1]
      }, {
        'nid': 3,
        'group': 3,
        'connections': [1]
      }]
    }, {
      'lid': 3,
      'nodesNum': 1,
      'nodes': [{
        'nid': 1,
        'group': 2,
        'connections': []
      }]
    }]
  }
}
