let app = Vue.createApp({
  data() {
    return {
      showSidebar: false,

      // This inventory object will be populated with the data from the food.json file
      inventory: [],

      // This cart object will store the items that are added to the cart
      cart: {}
    }
  },
  computed: {
    // Calculate the total quantity of items in the cart
    totalQuantity() {
      return Object.values(this.cart).reduce((total, quantity) => {
        return total + quantity
      }, 0)
    }
  },
  methods: {
    // Add the quantity of a product to the cart
    addToCart(index) {
      // Set the cart to 0 if it doesn't exist
      if (!this.cart[index]) {
        this.cart[index] = 0
      }

      // Add whatever is in the inventory to the cart, based on the type
      this.cart[index] += this.inventory[index].quantity

      // Reset the inventory to 0
      this.inventory[index].quantity = 0

      console.log(this.cart)
    },

    // Toggle the sidebar
    toggleSidebar() {
      console.log(this.showSidebar)
      this.showSidebar = !this.showSidebar
    },

    removeItem(index) {
      // Remove the item from the cart
      // Please note that the key is the index of the item in the inventory object
      delete this.cart[index]
    }
  },

  // This is a lifecycle hook that will be called when the component is mounted.
  // The async keywork will make the mounted method return a promise, and the await keyword is used to pause the function execution until the promise is resolved.
  // A `promise` is used to represents a value that may not be available yet but will be resolved at some point in the future.
  async mounted() {
    const rsp = await fetch('./food.json')
    const data = await rsp.json()
    this.inventory = data
  }
})

app.component('sidebar',{
  // "toggle" is the function that will be called when the user clicks on the close button
  props: ['toggle', 'inventory', 'cart', 'remove'],
  computed: {
    cartTotal() {
      // Calculate the total price of the cart
      // Please note that the key is the index of the item in the inventory object
      return Object.keys(this.cart).reduce((total, key) => {
        return total + this.inventory[key].price.USD * this.cart[key]
      }, 0).toFixed(2)
    }
  },
  template: `
    <aside class="cart-container">
    <div class="cart">
      <h1 class="cart-title spread">
        <span>
          Cart
          <i class="icofont-cart-alt icofont-1x"></i>
        </span>
        <!-- Use the toggle method to close the sidebar -->
        <button @click="toggle" class="cart-close">&times;</button>
      </h1>

      <div class="cart-body">
        <table class="cart-table">
          <thead>
            <tr>
              <th><span class="sr-only">Product Image</span></th>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <!-- Use the v-for directive to loop through the cart object -->
            <tr v-for="(quantity, product_index, i) in cart" :key="i">
              <td class="center"><i class="icofont-{{ inventory[product_index].icon }} icofont-3x"></i></td>
              <td class="center">{{ inventory[product_index].name }}</td>
              <td class="center">\${{ inventory[product_index].price.USD }}</td>
              <td class="center">{{ quantity }}</td>
              <td class="center">\${{ (inventory[product_index].price.USD * quantity).toFixed(2) }}</td>
              <td class="center">
                <button @click="remove(product_index)" class="btn btn-light cart-remove">
                  &times;
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p class="center" v-if="!Object.keys(cart).length"><em>No items in cart</em></p>
        <div class="spread">
          <!-- Remember to use the $ sign to display the total price -->
          <span><strong>Total:</strong> \${{ cartTotal }} </span>
          <button class="btn btn-light">Checkout</button>
        </div>
      </div>
    </div>
  </aside>
  `
})

// Always remember to mount your app
app.mount('#app')