const tagsView = {
  state: {
    visitedViews: [],
    cachedViews: []
  },
  mutations: {
    ADD_VISITED_VIEWS: (state, view) => {
      if (view.name === 'loginIndex') {
        return
      }
      // 先检测是否有相同full路径
      let status = state.visitedViews.some((v) => {
        return v.fullPath === view.fullPath
      })
      if (status && state.visitedViews.length >= 1) { return }
      state.visitedViews.push({
        name: view.name,
        path: view.path,
        fullPath: view.fullPath,
        query: view.query,
        title: view.meta.title || 'no-name'
      })
      if (!view.meta.noCache) {
        state.cachedViews.push({ name: view.name, fullPath: view.fullPath })
      }
    },
    /**
     * 匹配fullpath进行删除,当前的标签
     * */
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.fullPath === view.fullPath) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
      state.cachedViews.map((v, i) => {
        if (v.fullPath === view.fullPath) {
          state.cachedViews.splice(i, 1)
        }
      })
    },
    DEL_OTHERS_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews = state.cachedViews.slice(index, i + 1)
          break
        }
      }
    },
    DEL_ALL_VIEWS: (state) => {
      state.visitedViews = []
      state.cachedViews = []
    }
  },
  actions: {
    addVisitedViews({ commit }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_OTHERS_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delAllViews({ commit, state }) {
      return new Promise((resolve) => {
        commit('DEL_ALL_VIEWS')
        resolve([...state.visitedViews])
      })
    }
  }
}

export default tagsView
