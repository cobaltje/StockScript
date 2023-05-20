import { supabase } from '/src/js/supabase.js';
import * as model from './model.js';
import productListView from './views/productListView.js';
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
    clearStateProduct();
    document.querySelector('#checkboxall').checked = false;
    // Load Search Results
    await model.loadProducts();

    // Render Results
    model.state.products.map(product => {
      productListView.renderList(product);
    });
  } catch (error) {
    console.error(`💥${error}`);
  }
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
  if (event.target.matches('.action-delete')) {
    const productId = Number(event.target.dataset.id);
    const productName = event.target.dataset.productname;
    return deleteSelectedProduct(productId, productName);
  }

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
};

const deleteSelectedProduct = function (productId, productName) {
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
        await model.deleteProduct(productId);
        Swal.fire('Deleted!', `${productName} has been deleted.`, 'success');
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
  const productValid = [];
  const productInvalid = [];
  const productMax = [];
  const productMin = [];
  // Update for all items
  new Promise((resolve, reject) => {
    products.forEach(async function (product, i) {
      const newQty = Number(product.stock) + Number(quantity);
      console.log(newQty);
      if (newQty >= 0) {
        productValid.push(product.productname);
        await model.updateProductStock(Number(product.id), newQty);
      }
      if (newQty < 0) {
        productInvalid.push(product.productname);
      }

      if (i === products.length - 1)
        resolve(
          (function () {
            // Resolve steps to follow
            if (model.state.search.query)
              return controlResetResultsWithSearch();
            productListResults();
          })()
        );
    });
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

  console.log(e.target.checked);
});

/**** */

const init = function () {
  productListResults();
  searchView.addHandlerSearch(controlSearchResults);
  resetListView.addHandlerResetList(resetListResults);
  productView.addHandlerProductView(controlProductView);
  eventListenerView.actionEventListeners(controlActions);
};

init();

export { controlActions };
