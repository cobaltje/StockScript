import View from './View';
import { state } from '../model';

class ProductView extends View {
  _parentElement = document.querySelector('.productlist');
  _parentTableElement = document.querySelector('.product-table');
  _deleteElement = document.querySelector('.action-delete');

  addHandlerProductView(handler) {
    this._parentTableElement.addEventListener('click', function (e) {
      const selectedRow = e.target.closest('tr');
      selectedRow.classList.add('selected'); // HIER VERDER DOEN
      // https://stackoverflow.com/questions/24750623/select-a-row-from-html-table-and-send-values-onclick-of-a-button

      const selectedProduct = Number(e.target.closest('tr').dataset.productid);
      if (isNaN(selectedProduct)) return;
      this._selectedProductId = selectedProduct;
      handler(selectedProduct);
    });
  }

  renderProductView(data, windowActive, render = true) {
    if (windowActive) {
      document.querySelector('.productoverview').remove();
    }

    this._data = data;
    const markup = this._generateMarkup(); // REMOVED DATA
    if (!render) return markup;
    this._parentElement.insertAdjacentHTML('afterend', markup);
  }

  editProduct(product) {
    const table = document.querySelector('.productoverview-table');
    table.innerHTML = '';
    const markup = this._generateMarkupEdit();

    table.insertAdjacentHTML('beforeend', markup);
  }

  updateProduct() {
    const productArr = state.products;
    console.log(productArr);
    const index = productArr.findIndex(
      product => product.id === state.activeProductId
    );
    console.log(productArr[index]);
    // QSelectors
    const productName = document.querySelector('#productname').value;
    const stockLocation = document.querySelector('#stocklocation').value;
    const imgURL = document.querySelector('#imageurl').value;
    const minimumStock = document.querySelector('#minimumstock').value;
    const maximumStock = document.querySelector('#maximumstock').value;

    // Update
    const product = productArr[index];

    product.productname = productName;
    product.stocklocation = stockLocation;
    product.imageurl = imgURL;
    product.minimumstock = Number(minimumStock);
    product.maximumstock = Number(maximumStock);
    return product;
  }

  _generateMarkupEdit() {
    return `
    <tr>
      <th>Product</th>
      <td><input class="editproductinput" type="text" id="productname" value="${this._data.productname}"></td>
    </tr>
    <tr>
    <th>ProductId</th>
    <td>${this._data.id}</td>
  </tr>
    <tr>
      <th>StockLocation</th>
      <td><input class="editproductinput" type="text" id="stocklocation" value="${this._data.stocklocation}"></td>
    </tr>
    <tr>
    <th>Picture</th>
    <td><input class="editproductinput" type="url" id="imageurl" value="${this._data.imageurl}"></td>
  </tr>
    <tr>
      <th>Current Stock</th>
      <td>${this._data.stock}</td>
    </tr>
    <tr>
      <th>Minimum Stock</th>
      <td><input class="editproductinput" type="number" id="minimumstock" value="${this._data.minimumstock}"></td>
    </tr>
    <tr>
      <th>Maximum Stock</th>
      <td><input class="editproductinput" type="number" id="maximumstock" value="${this._data.maximumstock}"></td>
    </tr>
    <tr>
      <th>Actions</th>
      <td>
        <button class="save-editbtn">
        <i class="fa-solid fa-xmark"></i> Save
        </button>
        <button  class="cancel-editbtn">
        <i class="fa-solid fa-xmark"></i> Cancel
        </button>
      </td>
    </tr>
    `;
  }

  _generateMarkup() {
    return `
    <div class="productoverview">
          <div class="productoverview-heading">
            <i class="fa-solid fa-folder-open productoverview-title-icon"></i>
            <span class="product-title">${this._data.productname}</span>
              <i class="fa-solid fa-circle-xmark product-close"></i>
          </div>
          <div class="productoverview-actions">
            <span class="productoverview-action action-movements" data-id="${this._data.id}" data-productname="${this._data.productname}"><i class="fa-solid fa-list-ul"></i> Movements</span
            >
            <span class="productoverview-action action-edit" data-id="${this._data.id}" data-productname="${this._data.productname}"><i class="fa-solid fa-pen-to-square productrow-icon"></i> Edit
              Product</span
            >
            <span class="productoverview-action action-delete" data-id="${this._data.id}" data-productname="${this._data.productname}"><i class="fa-solid fa-trash-can productrow-icon"></i> Delete
              Product</span
            >
          </div>
          <div class="productoverview-content">
            <div class="imgcontainer">
              <a href="${this._data.imageurl}" target="_blank"><img
                src="${this._data.imageurl}"
                alt="${this._data.productname}"
                width="150"
                height="150"
              /></a>
            </div>
          
            <div class="productoverview-stockactions">
            <span class="productoverview-action stock-action action-stock-add" data-id="${this._data.id}" data-productname="${this._data.productname}"><i class="fa-solid fa-circle-plus"></i> Add stock</span>
            <span class="productoverview-action stock-action action-stock-remove" data-id="${this._data.id}" data-productname="${this._data.productname}"><i class="fa-solid fa-circle-minus"></i> Remove stock</span>
            </div>

            <div class="product-subtitle"
              ><i class="fa-solid fa-clipboard productoverview-title-icon"></i> Product Details</div
            >
            <table class="productoverview-table">
              <tr>
                <th>Product</th>
                <td>${this._data.productname}</td>
              </tr>
              <tr>
              <th>ProductId</th>
              <td>${this._data.id}</td>
            </tr>
              <tr>
                <th>StockLocation</th>
                <td>${this._data.stocklocation}</td>
              </tr>
              <tr>
                <th>Current Stock</th>
                <td>${this._data.stock}</td>
              </tr>
              <tr>
                <th>Minimum Stock</th>
                <td>${this._data.minimumstock}</td>
              </tr>
              <tr>
                <th>Maximum Stock</th>
                <td>${this._data.maximumstock}</td>
              </tr>
            </table>
          </div>
        </div>
    `;
  }
}

export default new ProductView();
