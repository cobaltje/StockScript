import View from './View';

class ProductListView extends View {
  _parentElement = document.querySelector('.product-table-data');

  _generateMarkup() {
    return `
    <tr class="table-productrow" data-productid="${this._data.id}">
      <td><input type="checkbox" /></td>
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
