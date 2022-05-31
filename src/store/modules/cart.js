import {deleteProductInCart, getCart, insertProductInCart, updateProductInCart} from "@/api/cart";

const state = {
  isCartDisplayed: false,
  cart: []
}
const mutations = {
  SET_CART_STATE: (state, cartState) => {
    state.isCartDisplayed = cartState
  },
  SET_CART: (state, cart) => {
    state.cart = cart
  }
}
const actions = {
  showCart({commit}) {
    commit('SET_CART_STATE', true)
  },
  hideCart({commit}) {
    commit('SET_CART_STATE', false)
  },
  getCart({commit}) {
    return new Promise((resolve, reject) => {
      getCart()
        .then(data => {
          commit('SET_CART', data)
          resolve(data)
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    })
  },
  insertProduct({rootState, state}, {productId, quantity}) {
    return new Promise(((resolve, reject) => {
      console.log('add product ', productId, ', quantity ', quantity)
      const cartItem = {
        cartItemId: {
          username: rootState.user.username,
          productId: productId
        },
        quantity: quantity
      }
      insertProductInCart(cartItem)
        .then(data => {
          let isExists = false
          for (const cartItem of state.cart) {
            if (cartItem.shortProductDTO.id === data.shortProductDTO.id) {
              cartItem.quantity = data.quantity
              isExists = true
              break
            }
          }
          if (!isExists) {
            state.cart.unshift(data)
          }
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    }))
  },
  updateProduct({commit, rootState, state}, product) {
    return new Promise((resolve, reject) => {
      const cartItem = {
        cartItemId: {
          username: rootState.user.username,
          productId: product.shortProductDTO.id
        },
        quantity: product.quantity
      }
      updateProductInCart(cartItem)
        .then(data => {
          for (const cartItem of state.cart) {
            if (cartItem.shortProductDTO.id === data.shortProductDTO.id) {
              cartItem.quantity = data.quantity
              break
            }
          }
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  deleteProduct: ({state}, product) => {
    return new Promise(((resolve, reject) => {
      deleteProductInCart(product.shortProductDTO.id)
        .then(() => {
          state.cart.splice(state.cart.indexOf(product), 1)
          resolve()
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    }))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
