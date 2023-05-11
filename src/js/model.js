import { supabase } from './supabase.js';

export const state = {
  products: [],
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
