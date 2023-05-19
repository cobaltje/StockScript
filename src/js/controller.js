import { supabase } from '/src/js/supabase.js';
import * as model from '/src/js/model.js';
import productListView from '/src/js/views/productListView.js';
import searchView from '/src/js/views/searchView.js';
import resetListView from '/src/js/views/resetListView.js';
import productView from '/src/js/views/productView.js';
import 'core-js/stable';
import { clearStateProduct } from './model';
import Swal from 'sweetalert2';

const productListResults = async function () {
  try {
    // Clear previous results
    productListView._clear();
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

const resetListResults = async function () {
  try {
    // 1) Clear previous results & state
    clearStateProduct();
    productListView._clear();

    // 2) Render full list again
    productListResults();
  } catch (error) {
    console.error(`💥${error}`);
  }
};

const controlProductView = function (selectedProduct) {
  // 1) Get Product from State
  const product = model.state.products.find(
    product => product.id === selectedProduct
  );

  productWindowActive = model.state.activeProduct;
  productView.renderProductView(product, productWindowActive);
  model.state.activeProduct = true;
  model.state.activeProductId = product.id;
};

const controlProductActions = function (event) {
  // Product Action DELETE
  if (event.target.matches('.action-delete')) {
    const productId = Number(event.target.dataset.id);
    const productName = event.target.dataset.productname;
    return deleteSelectedProduct(productId, productName);
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

/**** */

const init = function () {
  productListResults();
  searchView.addHandlerSearch(controlSearchResults);
  resetListView.addHandlerResetList(resetListResults);
  productView.addHandlerProductView(controlProductView);
  productView.actionEventListeners();
};

init();

export { controlProductActions };
