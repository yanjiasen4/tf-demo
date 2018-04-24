const state = {
  time: 0
}

const mutations = {
  SET_TIME (state, payload) {
    state.time = payload.time
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('SET_TIME')
  }
}

export default {
  state,
  mutations,
  actions
}
