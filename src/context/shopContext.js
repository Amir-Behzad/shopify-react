import React, { Component } from 'react'
import Client from 'shopify-buy'

const ShopContext = React.createContext()

const client = Client.buildClient({
  storefrontAccessToken: "dd4d4dc146542ba7763305d71d1b3d38",
  domain: "graphql.myshopify.com",
});


class ShopProvider extends Component {


  state = {
    products: [],
    product: {},
    checkout: {},
    isCartOpen: false,
    test: 'test'
  }


  componentDidMount() {
    // Check if localstorage has a check_id saved
    if (localStorage.checkout_id) {
      this.fetchCheckout(localStorage.checkout_id)
    } else {
      this.createCheckout()
    }
    // if there is no checkout_id in localstorage then we create a new checkout

    // else fetch checkout from shopify

  }

  createCheckout = async () => {
    const checkout = await client.checkout.create();
    localStorage.setItem("checkout_id", checkout.id);
    await this.setState({ checkout: checkout })
  }

  fetchCheckout = async (checkoutId) => {
    client.checkout.fetch(checkoutId).then((checkout) => {
      this.setState({ checkout: checkout });
    })
      .catch(err => console.log(err));
  }

  addItemToCheckout = async (variantId, quantity) => {
    const lineItemsToAdd = [{
      variantId,
      quantity: parseInt(quantity, 10)
    }]

    const checkout = await client.checkout.addLineItems(this.state.checkout.id, lineItemsToAdd)
    this.setState({ checkout: checkout })
  }

  fetchAllProducts = async () => {
    const products = await client.product.fetchAll()
    this.setState({ products })
  }

  fetchProductWithId = async (id) => {
    const product = await client.product.fetch(id)
    this.setState({ product })
  }

  closeCart = () => {
    this.setState({ isCartOpen: false })
  }

  openCart = () => {
    this.setState({ isCartOpen: true })
  }

  render() {
    return (
      <ShopContext.Provider
        value={{
          ...this.state,
          fetchAllProducts: this.fetchAllProducts,
          fetchProductWithId: this.fetchProductWithId,
          closeCart: this.closeCart,
          openCart: this.openCart,
          addItemToCheckout: this.addItemToCheckout
        }}>
        {this.props.children}
      </ShopContext.Provider>
    )
  }
}

const ShopConsumer = ShopContext.Consumer

export { ShopConsumer, ShopContext }

export default ShopProvider