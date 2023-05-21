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
      .ilike('productname', `%${query}%`)
      .order('id', { ascending: false });

    const data = res.data;
    data.forEach(result => state.products.push(result));
    return state.products;
  } catch (error) {
    console.error(error);
  }
};

// Clear the product state
export const clearStateProduct = function () {
  state.products = [];
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

// Update stock
export const updateProductStock = async function (productId, newStock) {
  try {
    const { error } = await supabase
      .from('product')
      .update({ stock: newStock })
      .eq('id', productId);
  } catch (error) {
    console.error(error);
  }
};

// Add movement
export const addMovement = async function (
  productId,
  prevStock,
  changeStock,
  newStock
) {
  try {
    const { error } = await supabase.from('movement').insert({
      productid: Number(productId),
      prevstockamount: prevStock,
      changestockamount: changeStock,
      newstockamount: newStock,
    });
  } catch (error) {
    console.error(error);
  }
};

// Add product
export const addProduct = async function (newProduct) {
  try {
    console.log(newProduct);
    const { error } = await supabase.from('product').insert({
      productname: newProduct[0],
      stocklocation: newProduct[1],
      imageurl: newProduct[2],
      stock: newProduct[3],
      minimumstock: newProduct[4],
      maximumstock: newProduct[5],
    });
    if (error) return error.message;
  } catch (error) {
    console.log('oh no');
    console.error(error);
  }
};
