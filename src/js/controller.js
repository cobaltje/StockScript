import { supabase } from './supabase.js';
import * as model from './model.js';
import productListView from './views/productListView.js';

const productListResults = async function () {
  try {
    // Load Search Results
    await model.loadProducts();
    // Render Results
    const datatest = [1, 2, 3];
    productListView.render(datatest);
  } catch (error) {
    console.error(`💥${error}`);
  }
};

productListResults();
