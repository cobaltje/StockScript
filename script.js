'use strict';

// Product list
const product = [
  {
    id: 1,
    name: 'Keyboard Logitech',
    stockLocation: 'IT Room',
    stock: {
      currentStock: 7,
      minimumStock: 5,
      maximumStock: 10,
    },
  },
  {
    id: 2,
    name: 'Mouse Logitech',
    stockLocation: 'IT Room',
    stock: {
      currentStock: 8,
      minimumStock: 2,
      maximumStock: 15,
    },
  },
  {
    id: 3,
    name: 'Dell Monitor 24inch',
    stockLocation: 'IT Room',
    stock: {
      currentStock: 7,
      minimumStock: 4,
      maximumStock: 8,
    },
  },
  {
    id: 4,
    name: 'A4 paper',
    stockLocation: 'Reception',
    stock: {
      currentStock: 15,
      minimumStock: 5,
      maximumStock: 25,
    },
  },
];

// HTML Values
// Loop for checking all values
checkHTML();
function checkHTML() {
  for (let i = 1; i <= product.length; i++) {
    document.getElementById(`productId${i}`).innerHTML = product[i - 1].id;
    document.getElementById(`productName${i}`).innerHTML = product[i - 1].name;
    document.getElementById(`productLocation${i}`).innerHTML = product[i - 1].stockLocation;
    document.getElementById(`productStock${i}`).innerHTML = product[i - 1].stock.currentStock;
    document.getElementById(`productMinStock${i}`).innerHTML = product[i - 1].stock.minimumStock;
    document.getElementById(`productMaxStock${i}`).innerHTML = product[i - 1].stock.maximumStock;
  }
}

// Bootstrap Alert Function
const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

const alert = (message, type) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>',
  ].join('');

  alertPlaceholder.append(wrapper);
};

// StockCalculation
function stockCalculation(productId, stockChange, changeAmount) {
  if (stockChange === 'add') {
    if (changeAmount) {
      let productStock = product[productId].stock.currentStock;
      let productItem = product[productId].stock;
      if (productStock + changeAmount > productItem.maximumStock) {
        let allowedAmount = productItem.maximumStock - productStock;
        swal({
          title: 'Not possible!',
          text: `The maximum amount of stock for ${product[productId].name} is ${productItem.maximumStock}! The maximum amount you can add is: ${allowedAmount} piece${
            allowedAmount > 1 ? 's.' : '.'
          }`,
          type: 'warning',
        });
        return;
      } else {
        productStock = product[productId].stock.currentStock += changeAmount;
        document.getElementById(`productStock${productId + 1}`).innerHTML = productStock;
        swal({
          title: `${changeAmount} piece${changeAmount > 1 ? 's' : ''} added!`,
          text: `${changeAmount} piece${changeAmount > 1 ? 's' : ''} added for ${product[productId].name}`,
          type: 'success',
        });
        checkAvailMinStock();
      }
    }

    //
  } else if (stockChange === 'remove') {
    if (changeAmount) {
      let productStock = product[productId].stock.currentStock;
      if (productStock - changeAmount < 0) {
        swal({
          title: `You can't remove that many pieces`,
          text: `Not enough stock available`,
          type: 'warning',
        });
      } else {
        productStock = product[productId].stock.currentStock -= changeAmount;
        document.getElementById(`productStock${productId + 1}`).innerHTML = productStock;
        swal({
          title: `${changeAmount} piece${changeAmount > 1 ? 's' : ''} removed!`,
          text: `${changeAmount} piece${changeAmount > 1 ? 's' : ''} removed from ${product[productId].name}`,
          type: 'success',
        });
        checkAvailMinStock();
      }
    }
  }
  checkAvailMinStock();
}

// addStock function
function addStock(productId) {
  if (product[productId].stock.currentStock === product[productId].stock.maximumStock) {
    swal({
      title: `Stock is full for ${product[productId].name}`,
      text: `You can not add more stock to this item`,
      type: 'warning',
    });
    return;
  } else {
    $('#modalAddStock').modal('toggle');
    document.querySelector('.addStock').textContent = product[productId].name;
    document.querySelector('.saveAddStock').addEventListener('click', function addItems() {
      const changeAmount = Number(document.querySelector('.stockToAdd').value);
      stockCalculation(productId, 'add', changeAmount);
      this.removeEventListener('click', addItems);
      document.querySelector('.stockToAdd').value = '';
    });
  }
}

// popup modal to ask how many pieces to add.

function removeStock(productId) {
  if (product[productId].stock.currentStock === 0) {
    swal({
      title: `Stock empty!`,
      text: `You can't remove pieces from an empty stock!`,
      type: 'warning',
    });
  } else {
    $('#modalRemoveStock').modal('toggle');
    document.querySelector('.removeStock').textContent = product[productId].name;
    document.querySelector('.saveRemoveStock').addEventListener('click', function removeItems() {
      const changeAmount = Number(document.querySelector('.stockToRemove').value);
      stockCalculation(productId, 'remove', changeAmount);
      this.removeEventListener('click', removeItems);
      document.querySelector('.stockToRemove').value = '';
    });
  }
  // popup modal to ask how many pieces to remove.
}

// Check for products with less stock then minimum
// less then minimum - red (danger)
// equal minimum - orange (warning)
function checkAvailMinStock() {
  for (const productCheck of product) {
    if (productCheck.stock.currentStock === 0) {
      document.getElementById(`productId${productCheck.id}`).style.backgroundColor = '#B93744';
      document.getElementById(`productName${productCheck.id}`).style.backgroundColor = '#B93744';
      document.getElementById(`productLocation${productCheck.id}`).style.backgroundColor = '#B93744';
      document.getElementById(`productStock${productCheck.id}`).style.backgroundColor = '#B93744';
      document.getElementById(`productMinStock${productCheck.id}`).style.backgroundColor = '#B93744';
      document.getElementById(`productMaxStock${productCheck.id}`).style.backgroundColor = '#B93744';
      document.getElementById(`productButtons${productCheck.id}`).style.backgroundColor = '#B93744';
    } else if (productCheck.stock.currentStock < productCheck.stock.minimumStock) {
      document.getElementById(`productStock${productCheck.id}`).style.backgroundColor = '#F5787a';
      document.getElementById(`productId${productCheck.id}`).style.backgroundColor = '';
      document.getElementById(`productName${productCheck.id}`).style.backgroundColor = '';
      document.getElementById(`productLocation${productCheck.id}`).style.backgroundColor = '';
      document.getElementById(`productMinStock${productCheck.id}`).style.backgroundColor = '';
      document.getElementById(`productMaxStock${productCheck.id}`).style.backgroundColor = '';
      document.getElementById(`productButtons${productCheck.id}`).style.backgroundColor = '';
    } else if (productCheck.stock.currentStock === productCheck.stock.minimumStock && productCheck.stock.minimumStock != productCheck.stock.maximumStock) {
      document.getElementById(`productStock${productCheck.id}`).style.backgroundColor = '#Fdbf43';
      document.getElementById(`productId${productCheck.id}`).style.backgroundColor = '';
      document.getElementById(`productName${productCheck.id}`).style.backgroundColor = '';
      document.getElementById(`productLocation${productCheck.id}`).style.backgroundColor = '';
      document.getElementById(`productMinStock${productCheck.id}`).style.backgroundColor = '';
      document.getElementById(`productMaxStock${productCheck.id}`).style.backgroundColor = '';
      document.getElementById(`productButtons${productCheck.id}`).style.backgroundColor = '';
      // oranje
    } else {
      document.getElementById(`productId${productCheck.id}`).style.backgroundColor = '';
      document.getElementById(`productName${productCheck.id}`).style.backgroundColor = '';
      document.getElementById(`productLocation${productCheck.id}`).style.backgroundColor = '';
      document.getElementById(`productStock${productCheck.id}`).style.backgroundColor = '';
      document.getElementById(`productMinStock${productCheck.id}`).style.backgroundColor = '';
      document.getElementById(`productMaxStock${productCheck.id}`).style.backgroundColor = '';
      document.getElementById(`productButtons${productCheck.id}`).style.backgroundColor = '';
    }
  }
}
checkAvailMinStock();

// Adding a new product to the Object
const addProductPlaceholder = document.getElementById('addProductPlaceholder');
function addProduct(productTitle, stockLocation, starterStock, minimumStock, maximumStock) {
  const id = product.length + 1;
  product.push({
    id: id,
    name: productTitle,
    stockLocation: stockLocation,
    stock: {
      currentStock: starterStock,
      minimumStock: minimumStock,
      maximumStock: maximumStock,
    },
  });
  const wrapper = document.createElement('tr');
  wrapper.innerHTML = [
    `<th id="productId${id}" scope="row">${id}</th> 
    <td id="productName${id}" scope="row">${productTitle}</td>
    <td id="productLocation${id}" scope="row">${stockLocation}</td>
    <td id="productStock${id}" scope="row" style="text-align: center;">${starterStock}</td>
    <td id="productMinStock${id}" scope="row" style="text-align: center;">${minimumStock}</td>
    <td id="productMaxStock${id}" scope="row" style="text-align: center;">${maximumStock}</td>
    <td id="productButtons${id}" scope="row" style="text-align: right">
                        <button id="addStockButton" type="button" class="btn btn-primary btn-sm " onclick="addStock(${id - 1})">
                          <i class="fa fa-plus-square modal-icon"></i> Add Stock
                        </button>
                        <button id="removeStockButton" type="button" class="btn btn-danger btn-sm " onclick="removeStock(${id - 1})">
                          <i class="fa fa-minus-square modal-icon"></i> Remove Stock
                        </button>
                        <button id="editProductButton" type="button" class="btn btn-info btn-sm " onclick="editProduct(${id - 1})">
                          <i class="fa fa-pencil modal-icon"></i> Edit Product
                        </button>
                      </td>`,
  ];
  addProductPlaceholder.append(wrapper);
  checkAvailMinStock();
}

// adding products
//productTitle, stockLocation, starterStock, minimumStock, maximumStock
document.querySelector('.saveProduct').addEventListener('click', function () {
  const productTitle = document.querySelector('.newProductTitle').value;
  const productLocation = document.querySelector('.newProductLocation').value;
  const productStock = Number(document.querySelector('.newProductStock').value);
  const minStock = Number(document.querySelector('.newProductMinStock').value);
  const maxStock = Number(document.querySelector('.newProductMaxStock').value);
  let productExist = false;
  for (let i = 0; i < product.length; i++) {
    if (productTitle === product[i].name) productExist = true;
  }
  if (productTitle === '') {
    swal({
      title: `No product title!`,
      text: `You need to fill in a product title!`,
      type: 'warning',
    });
  } else if (productExist) {
    swal({
      title: 'Product already exist!',
      text: `${productTitle} is already in the list!`,
      type: 'warning',
    });
    return;
  } else {
    addProduct(productTitle, productLocation, productStock, minStock, maxStock);
    swal({
      title: `${productTitle} added!`,
      text: `${productTitle} has been added to the list!`,
      type: 'success',
    });
    resetProductInputValues();
  }
});

// Empty product input values
function resetProductInputValues() {
  (document.querySelector('.newProductTitle').value = ''),
    (document.querySelector('.newProductLocation').value = ''),
    (document.querySelector('.newProductStock').value = ''),
    (document.querySelector('.newProductMinStock').value = ''),
    (document.querySelector('.newProductMaxStock').value = '');
}

// Edit a product
function editProduct(productId) {
  const assignedProduct = product[productId];
  // Opening the modal
  $('#modalProductEdit').modal('toggle');
  // Filling in the values
  document.querySelector('.modalProductTitle').textContent = assignedProduct.name;
  document.querySelector('.editProductTitle').value = assignedProduct.name;
  document.querySelector('.editProductLocation').value = assignedProduct.stockLocation;
  document.querySelector('.editProductMinStock').value = assignedProduct.stock.minimumStock;
  document.querySelector('.editProductMaxStock').value = assignedProduct.stock.maximumStock;

  // Saving changes
  document.querySelector('.saveEditProduct').addEventListener('click', function editProduct() {
    const productToEdit = product[productId];
    // name
    productToEdit.name = document.querySelector('.editProductTitle').value;
    document.getElementById(`productName${productId + 1}`).textContent = productToEdit.name;
    // stocklocation
    productToEdit.stockLocation = document.querySelector('.editProductLocation').value;
    document.getElementById(`productLocation${productId + 1}`).textContent = productToEdit.stockLocation;
    // min stock
    productToEdit.stock.minimumStock = document.querySelector('.editProductMinStock').value;
    document.getElementById(`productMinStock${productId + 1}`).textContent = productToEdit.stock.minimumStock;
    // max stock
    productToEdit.stock.maximumStock = document.querySelector('.editProductMaxStock').value;
    document.getElementById(`productMaxStock${productId + 1}`).textContent = productToEdit.stock.maximumStock;
    // RESET EVENTLISTENER
    this.removeEventListener('click', editProduct);
  });
}
