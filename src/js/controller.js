import * as model from './model.js';
import productListView from './views/productListView.js';
import productLowView from './views/productLowView.js';
import searchView from './views/searchView.js';
import resetListView from './views/resetListView.js';
import productView from './views/productView.js';
import productsView from './views/productsView.js';
import stockChangeView from './views/stockChangeView.js';
import movementsView from './views/movementsView.js';
import newProductView from './views/newProductView.js';
import eventListenerView from './views/eventListenerView.js';
import 'core-js/stable';

import Swal from 'sweetalert2';

// Get a full dump from the products out of the database
const productListResults = async function () {
  try {
    // 1) Clear previous results
    productLowView._clear();
    model.clearStateProduct();
    document.querySelector('#checkboxall').checked = false;

    // 2) Load Results
    await model.loadProducts();
    const products = model.state.products;

    // 3) Clear list before re-adding the products (This prevent flickering if we do this after the db call)
    productListView._clear();
    // 4) Render Results
    const query = model.state.search.query;
    productsView.renderProducts(products, query);

    // 5) Look for products low on stock
    productLowView.controlLowOnStock(products);
  } catch (error) {
    console.error(`💥${error}`);
  }
};

// Filter the results based on the given query
const controlSearchResults = function () {
  // 1) Get Search Query
  const query = (model.state.search.query = searchView.getQuery());
  if (!query);

  // 2) Empty table & clear input
  productListView._clear();
  document.querySelector('#checkboxall').checked = false;

  // 3) Render results based on query
  model.state.products.map(product => {
    if (product.productname.toLowerCase().includes(query))
      productListView.renderList(product);
  });

  // 5) Display Remove filter button
  productsView.displayFilterButton(query);
};

// Reset the filterd productlist to all products
const resetListResults = function () {
  // 1) Set Query state to empy string
  model.state.search.query = '';

  // 2) Remove the filter btn and tag
  resetListView.removeFilterBtnAndTag();

  // 3) Clear the list
  productListView._clear();

  // 3) Render the full productlist
  const products = model.state.products;
  productsView.renderProducts(products);
};

const controlProductView = function (selectedProduct) {
  // 1) Get Product from State
  const product = model.state.products.find(
    product => product.id === selectedProduct
  );

  // 2) Render productView
  const productWindowActive = model.state.activeProduct;
  productView.renderProductView(product, productWindowActive);
  model.state.activeProduct = true;
  model.state.activeProductId = product.id;
};

const controlActions = function (event) {
  console.log(event.target);
  // Product Action DELETE
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

  // Render movements
  if (event.target.matches('.action-movements')) {
    renderMovements();
  }

  if (event.target.matches('.action-edit')) {
    editProduct();
  }

  if (event.target.matches('.save-editbtn')) {
    saveEditProduct();
  }

  if (event.target.matches('.stockchange-close')) {
    // Close stockchanges results
    const stockCalcResultsElement = document.querySelector('.stockcalcresults');
    const productTableElement = document.querySelector('.productlist');

    stockCalcResultsElement.classList.add('hidden');
    productTableElement.classList.remove('hidden');
  }

  if (event.target.matches('.movements-close')) {
    // Close stockchanges results
    const productTableElement = document.querySelector('.productlist');
    const movementsTableElement = document.querySelector('.movements');

    productTableElement.classList.remove('hidden');
    movementsTableElement.classList.add('hidden');
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
    const productWindowActive = model.state.activeProduct;
    newProductView.renderNewProductView(productWindowActive);
  }
};

const renderMovements = async function () {
  const movements = await model.getMovements();
  movementsView._clear();
  movementsView.renderMovements(movements);
  const stockCalcResultsElement = document.querySelector('.stockcalcresults');
  const productTableElement = document.querySelector('.productlist');
  const movementsTableElement = document.querySelector('.movements');

  stockCalcResultsElement.classList.add('hidden');
  productTableElement.classList.add('hidden');
  movementsTableElement.classList.remove('hidden');
};

const editProduct = function () {
  const product = model.state.products.find(
    product => product.id === model.state.activeProductId
  );
  productView.editProduct(product);
};

const saveEditProduct = async function () {
  // Update product in State
  const index = productView.updateProduct();
  await model.updateProduct(index);
  controlProductView(model.state.activeProductId);
  productListResults();
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
        productListResults();
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
  const productMin = [];
  const productMax = [];

  await Promise.all(
    products.map(async function (product) {
      // Set the new stock quantity
      const newQty = Number(product.stock) + Number(quantity);

      // Update the stock in the database
      if (newQty >= 0) {
        productValid.push(product.productname);
        await model.updateProductStock(Number(product.id), newQty);

        // Add a movement to the database
        await model.addMovement(product.id, product.stock, quantity, newQty);
      }

      // If newQty would be lower than 0, add them to the array and don't update stock
      if (newQty < 0) productInvalid.push(product.productname);

      // If newQty is bigger than the maxstock, add them to the array

      if (newQty > product.maxstock && product.stock < product.maxstock)
        productMax.push(product.productname);

      // If newQty is lower or equal to the minstock, add them to the array - Don't add when stock hasn't changed
      if (
        newQty <= product.minstock &&
        newQty >= 0 &&
        product.stock > product.minstock
      )
        productMin.push(product.productname);
    })
  );

  // All promises are fulfilled, call productListResults
  await productListResults();
  // Refresh product sideview if open
  if (model.state.activeProductId)
    controlProductView(model.state.activeProductId);

  // ResultsScreen
  stockChangeView.createResultsScreen(
    productValid,
    productInvalid,
    productMin,
    productMax
  );
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

// Initialisation
const init = (function () {
  productListResults();
  searchView.addHandlerSearch(controlSearchResults);
  resetListView.addHandlerResetList(resetListResults);
  productView.addHandlerProductView(controlProductView);
  eventListenerView.actionEventListeners(controlActions);
})();

// Export function
export { controlActions };
