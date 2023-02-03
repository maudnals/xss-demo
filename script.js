console.log('hi from script');
// Extract the product from URL parameters
const urlParams = new URLSearchParams(window.location.search);
// Set the product name as a title for the product page
let product = urlParams.get('product');
document.getElementById(
  'product-name'
  // Danger!!!! innerHTML 😈
).innerHTML = `<div>${product}</div>`; // dangerous!
