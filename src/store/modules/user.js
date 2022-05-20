import {login, logout, getInfo, updateAvatar, updateInfo} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import {resetRouter} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: '',
    name: '',
    avatar: '',
    address: '',
    email: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ADDRESS: (state, address) => {
    state.address = address
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password} = userInfo
    return new Promise((resolve, reject) => {
      login({username: username.trim(), password: password}).then(data => {
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(data => {
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const {name, address, username, roles, email} = data
        let avatar = data.avatar
        if (avatar === null || avatar.length <= 0) {
          avatar = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg'
          data.avatar = avatar
        }
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_USERNAME', username)
        commit('SET_ADDRESS', address)
        commit('SET_ROLES', roles)
        commit('SET_EMAIL', email)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateAvatar({commit}, avatar) {
    return new Promise((resolve, reject) => {
      updateAvatar(avatar).then(data => {
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },

  updateUserInfo({commit}, user) {
    return new Promise((resolve, reject) => {
      updateInfo(user).then(data => {
        const {name, address, email} = data
        commit('SET_NAME', name)
        commit('SET_ADDRESS', address)
        commit('SET_EMAIL', email)
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

