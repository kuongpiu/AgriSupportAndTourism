import {
  login,
  logout,
  getInfo,
  updateAvatar,
  updateInfo,
  getAddresses,
  insertAddress,
  updateAddress,
  deleteAddress
} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import router, {resetRouter} from '@/router'
import {add} from "script-ext-html-webpack-plugin/lib/custom-attributes";

const getDefaultState = () => {
  return {
    token: getToken(),
    username: '',
    name: '',
    avatar: '',
    email: '',
    roles: [],
    addresses: []
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
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ADDRESSES: (state, addresses) => {
    state.addresses = addresses
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

        const {name, username, roles, email, addresses} = data
        let avatar = data.avatar
        if (avatar === null || avatar.length <= 0) {
          avatar = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg'
          data.avatar = avatar
        }
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_USERNAME', username)
        commit('SET_ROLES', roles)
        commit('SET_EMAIL', email)
        commit('SET_ADDRESSES', addresses.reverse())

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getAddress({commit, state}) {
    return new Promise((resolve, reject) => {
      getAddresses()
        .then(data => {
          console.log('receive addresses', data)
          commit('SET_ADDRESSES', data.reverse())
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  insertAddress({commit, state}, address) {
    return new Promise((resolve, reject) => {
      address.user = {
        username: state.username
      }
      insertAddress(address)
        .then(address => {
          state.addresses.unshift(address)
          resolve(address)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateAddress({commit, state}, address) {
    return new Promise((resolve, reject) => {
      address.user = {
        username: state.username
      }
      updateAddress(address)
        .then(address => {
          let i
          for (i = 0; i < state.addresses.length; i++) {
            const curAddress = state.addresses[i]
            if (curAddress.id === address.id) {
              state.addresses.splice(i, 1)
              break
            }
          }
          if (i <= state.addresses.length) {
            state.addresses.splice(i, 0, address)
          }
          resolve(address)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  deleteAddress({commit, state}, addressId) {
    return new Promise((resolve, reject) => {
      deleteAddress(addressId)
        .then(() => {
          let i
          for (i = 0; i < state.addresses.length; i++) {
            const curAddress = state.addresses[i]
            if (curAddress.id === addressId) {
              state.addresses.splice(i, 1)
              break
            }
          }
          resolve()
        })
        .catch(err => {
          reject(err)
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
        const {name, email} = data
        commit('SET_NAME', name)
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
  },

  async changeRoles({ commit, dispatch }) {
    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

