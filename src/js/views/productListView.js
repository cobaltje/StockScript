import View from './View';

class ProductListView extends View {
  _parentElement = document.querySelector('.product-table-data');

  getSelectedRows() {
    // Selecting the data table
    const table = document.querySelector('.product-table-data');
    const checkBoxes = table.querySelectorAll('input');
    const selectedProducts = [];

    for (let i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].checked) {
        selectedProducts.push(checkBoxes[i].dataset);
      }
    }

    return selectedProducts;
  }

  _generateMarkup() {
    return `
    <tr class="table-productrow ${this._data.stock}" data-productid="${this._data.id}">
      <td><input type="checkbox" id="${this._data.id}" class="checkbox" data-id="${this._data.id}" data-stock="${this._data.stock}" data-productname="${this._data.productname}" data-stocklocation="${this._data.stocklocation}" data-minstock="${this._data.minimumstock}" data-maxstock="${this._data.maximumstock}"/></td>
      <td>${this._data.id}</td>
      <td>${this._data.productname}</td>
      <td>${this._data.stocklocation}</td>
      <td>${this._data.stock}</td>
      <td>${this._data.minimumstock}</td>
      <td>${this._data.maximumstock}</td>
    </tr>
    `;
  }
}

export default new ProductListView();
