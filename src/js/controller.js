import { supabase } from '/src/js/supabase.js';
import * as model from './model.js';
import productListView from './views/productListView.js';
import productLowView from './views/productLowView.js';
import searchView from './views/searchView.js';
import resetListView from './views/resetListView.js';
import productView from './views/productView.js';
import eventListenerView from './views/eventListenerView.js';
import 'core-js/stable';
import { clearStateProduct } from './model';
import Swal from 'sweetalert2';

const productListResults = async function () {
  try {
    // Clear previous results
    productListView._clear();
    productLowView._clear();
    clearStateProduct();
    document.querySelector('#checkboxall').checked = false;
    // Load Search Results
    await model.loadProducts();

    // Render Results
    model.state.products.map(product => {
      productListView.renderList(product);
    });

    // Look for warning stocks
    const productsLow = controlLowOnStock(model.state.products);
    if (productsLow.length === 0) productLowView.renderLowProduct('empty');
    productsLow.map(product => {
      productLowView.renderLowProduct(product);
    });
  } catch (error) {
    console.error(`💥${error}`);
  }
};

const controlLowOnStock = function (products) {
  const productsLow = [];
  for (let i = 0; i <= products.length - 1; i++) {
    if (
      products[i].stock <= products[i].minimumstock &&
      products[i].stock !== products[i].maximumstock
    )
      productsLow.push(products[i]);
  }
  return productsLow;
};

const controlSearchResults = async function () {
  try {
    // 1) Get Search Query
    const query = searchView.getQuery();
    if (!query);

    // 3) Empty table & clear input

    clearStateProduct();
    productListView._clear();
    document.querySelector('#checkboxall').checked = false;

    // 2) Load Search Results
    await model.loadSearchResults(query);

    // 4) Render results
    model.state.products.map(product => {
      productListView.renderList(product);
    });

    // Look for warning stocks
    const productsLow = controlLowOnStock(model.state.products);
    if (productsLow.length === 0) productLowView.renderLowProduct('empty');
    productsLow.map(product => {
      productLowView.renderLowProduct(product);
    });

    // 5) Display Remove filter button
    const menu = document.querySelector('.filter-menu');
    const filterTxt = document.querySelector('.filter-text');
    menu.classList.remove('hidden');
    filterTxt.innerHTML = `<i class="fa-solid fa-tag"></i> ${query}`;
  } catch (error) {
    console.error(`💥${error}`);
  }
};

const controlResetResultsWithSearch = async function () {
  try {
    // 1) Get Search Query
    const query = model.state.search.query;
    if (!query);

    // 3) Empty table & clear input

    clearStateProduct();
    productListView._clear();
    document.querySelector('#checkboxall').checked = false;

    // 2) Load Search Results
    await model.loadSearchResults(query);

    // 4) Render results
    model.state.products.map(product => {
      productListView.renderList(product);
    });
  } catch (error) {
    console.error(`💥${error}`);
  }
};

const resetListResults = function () {
  productListResults();
  model.state.search.query = '';
  const menu = document.querySelector('.filter-menu');
  const filterTxt = document.querySelector('.filter-text');
  filterTxt.innerHTML = '';
  menu.classList.add('hidden');
};

const controlProductView = function (selectedProduct) {
  // 1) Get Product from State
  const product = model.state.products.find(
    product => product.id === selectedProduct
  );

  const productWindowActive = model.state.activeProduct;
  productView.renderProductView(product, productWindowActive);
  model.state.activeProduct = true;
  model.state.activeProductId = product.id;
};

const controlActions = function (event) {
  // Product Action DELETE
  console.log(event.target);
  if (event.target.matches('.action-delete')) {
    const productId = Number(event.target.dataset.id);
    const productName = event.target.dataset.productname;
    return deleteSelectedProduct(productId, productName);
  }

  // Close product sidebar
  if (event.target.matches('.product-close')) {
    document.querySelector('.productoverview').remove();
    model.state.activeProduct = '';
  }

  // CheckSelectProducts
  if (event.target.matches('.action-stockchange')) {
    const products = productListView.getSelectedRows();
    const changeAmount = event.target.dataset.value;
    if (products.length === 0) return;
    stockCalculation(products, changeAmount);
  }

  // LowOnStock selected product
  if (event.target.closest('.preview')) {
    const id = Number(
      event.target.closest('[data-productid]').dataset.productid
    );
    controlProductView(id);
  }

  // Create New Product
  if (event.target.matches('.addproduct')) {
    addProduct();
  }
};

const deleteSelectedProduct = function (productId, productName) {
  // Sweet alert warning
  Swal.fire({
    title: `Delete ${productName}?`,
    text: 'There is no way back after this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then(async result => {
    if (result.isConfirmed) {
      try {
        // Delete product from database
        await model.deleteProduct(productId);

        // Sweet alert succesfull delete
        Swal.fire('Deleted!', `${productName} has been deleted.`, 'success');

        // Reset
        resetListResults();
        document.querySelector('.productoverview').remove();
        model.state.activeProduct = '';
      } catch (error) {
        console.error(error);
      }
    }
  });
};

const stockCalculation = async function (products, quantity) {
  // Arrays for final results
  const productValid = [];
  const productInvalid = [];
  const productMax = [];
  const productMin = [];

  // Update stock for selected products
  products.forEach(async function (product, i) {
    // Set the new stock quantity
    const newQty = Number(product.stock) + Number(quantity);

    // Update the stock in the database
    if (newQty >= 0) {
      productValid.push(product.productname);
      await model.updateProductStock(Number(product.id), newQty);

      // Add a movement to the database
      await model.addMovement(product.id, product.stock, quantity, newQty);
    }

    // If newQty would be lower then 0 add them to the array and don't update stock
    if (newQty < 0) productInvalid.push(product.productname);

    // If newQty is bigger then the maxstock add them to the array
    if (newQty > product.maxstock) productMax.push(product.productname);

    // If newQty is lower or equal then the minstock add them to the array
    if (newQty <= product.minstock) productMin.push(product.productname);

    // If we reach the last product => End and refresh the list
    if (i === products.length - 1) {
      if (model.state.search.query) return controlResetResultsWithSearch();
      productListResults();
    }
  });
};

const stockCalcErorr = function (productName, error) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: `There is not enough stock for ${productName}!`,
  });
};

/* CheckList All */
const checkboxAll = document.querySelector('#checkboxall');
checkboxAll.addEventListener('click', function (e) {
  const table = document.querySelector('.product-table-data');
  const checkBoxes = table.querySelectorAll('input');
  e.target.checked
    ? checkBoxes.forEach(checkbox => (checkbox.checked = true))
    : checkBoxes.forEach(checkbox => (checkbox.checked = false));
});

/* New Product */

const addProduct = async function () {
  const { value: newProduct } = await Swal.fire({
    title: 'Add product',
    html:
      '<input id="newprod-productname" class="swal2-input" placeholder="Productname">' +
      '<input id="newprod-stocklocation" class="swal2-input" placeholder="Stocklocation">' +
      '<input id="newprod-image" type="url" class="swal2-input" placeholder="URL Image">' +
      '<input id="newprod-stock" type="number" class="swal2-input" placeholder="Stock">' +
      '<input id="newprod-minstock" type="number" class="swal2-input" placeholder="Minimum stock">' +
      '<input id="newprod-maxstock" type="number" class="swal2-input" placeholder="Maximum stock">',
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById('newprod-productname').value,
        document.getElementById('newprod-stocklocation').value,
        document.getElementById('newprod-image').value,
        document.getElementById('newprod-stock').value,
        document.getElementById('newprod-minstock').value,
        document.getElementById('newprod-maxstock').value,
      ];
    },
  });

  if (newProduct) {
    const result = await model.addProduct(newProduct);

    // Error
    if (result)
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${result}`,
      });

    // Success
    console.log('test');
    return Swal.fire({
      title: `${document.getElementById('newprod-productname').value}`,
      text: 'Product has been added!',
      imageUrl: `${document.getElementById('newprod-image').value}`,
      imageWidth: 200,
      imageHeight: 200,
      imageAlt: 'ProductImage',
    });
  }
};

// /**** */

const init = function () {
  productListResults();
  searchView.addHandlerSearch(controlSearchResults);
  resetListView.addHandlerResetList(resetListResults);
  productView.addHandlerProductView(controlProductView);
  eventListenerView.actionEventListeners(controlActions);
};

init();

export { controlActions };
