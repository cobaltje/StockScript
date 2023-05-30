import { supabase } from './supabase.js';

export const state = {
  products: [],
  activeProduct: false,
  activeProductId: 0,
  activeMovements: [],
  search: {
    query: '',
  },
};

// Loading all the products
export const loadProducts = async function () {
  try {
    state.products = [];
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
    const { data, error } = await supabase
      .from('product')
      .update({ stock: newStock })
      .eq('id', productId)
      .select();
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

// Get movements

export const getMovements = async function () {
  try {
    state.activeMovements = [];
    const res = await supabase
      .from('movement')
      .select('*')
      .order('created_at', { ascending: true })
      .eq('productid', state.activeProductId);
    const data = res.data;
    data.forEach(movement => state.activeMovements.push(movement));
    return state.activeMovements;
  } catch (error) {}
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
