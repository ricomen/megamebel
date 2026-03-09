import { resolve } from 'path'

const pages = [
  {name: 'index', path: resolve(__dirname, '../index.html')},
  {name: 'home', path: resolve(__dirname, '../pages/home.html')},
  {name: 'listing', path: resolve(__dirname, '../pages/listing.html')},
  {name: 'product', path: resolve(__dirname, '../pages/product.html')},
  {name: 'cart', path: resolve(__dirname, '../pages/cart.html')},
  {name: 'checkout', path: resolve(__dirname, '../pages/checkout.html')},
  {name: 'comparsion', path: resolve(__dirname, '../pages/comparsion.html')},
  {name: 'ui-kit', path: resolve(__dirname, '../pages/ui-kit.html')},
];

export default pages