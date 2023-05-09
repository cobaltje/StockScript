import { supabase } from './supabase.js';

export const state = {
  product: {},
};

export const loadProducts = async function () {
  try {
    const data = await supabase.from('product').select('*');
    state.product = createProductObject(data.data);
  } catch (error) {
    console.log(error);
  }
};

const createProductObject = function (data) {
  console.log('CreateProductObject');
  console.log(data);
  console.log(state.product);
  data.forEach(product =>  return {
    id: product.id,
    productName: product.productName,
    stockLocation: product.stockLocation,
    stock: product.stock,
    minStock: product.minimumStock,
    maxStock: product.maximumStock,
  });

  
};
