import { supabase } from '/src/js/supabase.js';
import * as model from '/src/js/model.js';
import productListView from '/src/js/views/productListView.js';
import View from '/src/js/views/View.js';

const productListResults = async function () {
  try {
    // Load Search Results
    await model.loadProducts();

    // Render Results
    model.state.products.forEach(product => productListView.render(product));
  } catch (error) {
    console.error(`💥${error}`);
  }
};

const init = function () {
  productListResults();
};

init();
