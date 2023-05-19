import { supabase } from './supabase.js';

export const state = {
  products: [],
  activeProduct: false,
  activeProductId: 0,
  search: {
    query: '',
  },
};

// Loading all the products
export const loadProducts = async function () {
  try {
    const res = await supabase
      .from('product')
      .select('*')
      .order('id', { ascending: false });
    const data = res.data;
    data.forEach(product => state.products.push(product));
    return state.products;
  } catch (error) {
    console.log(error);
  }
};

// Loading the search results
export const loadSearchResults = async function (query) {
  try {
    state.products = [];
    state.search.query = query;
    const res = await supabase
      .from('product')
      .select('*')
      .ilike('productname', `%${query}%`);

    const data = res.data;
    data.forEach(result => state.products.push(result));
    return state.products;
  } catch (error) {
    console.error(error);
  }
};

// Clear the product state
export const clearStateProduct = function () {
  return (state.products = []);
};

// Delete product
export const deleteProduct = async function (productId) {
  try {
    const { error } = await supabase
      .from('product')
      .delete()
      .eq('id', productId);
  } catch (error) {
    console.error(error);
  }
};
