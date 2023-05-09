import View from './view';

class ProductListView extends View {
  _parentElement = document.querySelector('.product-table-data');

  _generateMarkup() {
    return `
    <tr>
      <td><input type="checkbox" /></td>
      <td>${this._data.id}</td>
      <td>${this._data.productName}</td>
      <td>${this._data.stockLocation}</td>
      <td>${this._data.stock}</td>
      <td>${this._data.minimumStock}</td>
      <td>${this._data.maximumStock}</td>
    </tr>
    `;
  }
}

export default new ProductListView();
