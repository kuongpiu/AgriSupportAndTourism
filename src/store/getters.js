const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  username: state => state.user.username,
  email: state => state.user.email,
  roles: state => state.user.roles,
  addresses: state => state.user.addresses,
  permission_routes: state => state.permission.routes,
  cartState: state => state.cart.isCartDisplayed,
  cart: state => state.cart.cart
}
export default getters
