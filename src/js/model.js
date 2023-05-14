import { supabase } from './supabase.js';

export const state = {
  products: [],
  activeProduct: false,
  search: {
    query: '',
  },
};

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

export const clearStateProduct = function () {
  return (state.products = []);
};
