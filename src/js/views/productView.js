import view from './view.js';

class ProductView extends view {
  _parentElement = document.querySelector('.productlist');
  _parentTableElement = document.querySelector('.product-table');

  addHandlerProductView(handler) {
    console.log(this._parentTableElement);
    this._parentTableElement.addEventListener('click', function (e) {
      const selectedProduct = Number(e.target.closest('tr').dataset.productid);
      if (isNaN(selectedProduct)) return;
      handler(selectedProduct);
    });
  }

  renderProductView(data, windowActive, render = true) {
    if (windowActive) {
      document.querySelector('.productoverview').innerHTML = '';
    }

    this._data = data;

    const markup = this._generateMarkup(data);

    if (!render) return markup;

    this._parentElement.insertAdjacentHTML('afterend', markup);
  }

  _generateMarkup() {
    return `
    <div class="productoverview">
          <div class="productoverview-heading">
            <i class="fa-solid fa-folder-open productoverview-title-icon"></i>
            <span class="product-title">${this._data.productname}</span>
            <i class="fa-solid fa-xmark"></i>
          </div>
          <div class="productoverview-actions">
            <span class="productoverview-action action-edit"
              ><i class="fa-solid fa-list-ul"></i> Movements</span
            >
            <span class="productoverview-action action-edit"
              ><i class="fa-solid fa-pen-to-square productrow-icon"></i> Edit
              Product</span
            >
            <span class="productoverview-action action-delete"
              ><i class="fa-solid fa-trash-can productrow-icon"></i> Delete
              Product</span
            >
          </div>
          <div class="productoverview-content">
            <div class="imgcontainer">
              <img
                src="https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTBa3S8LN_u6REW43N-55PKU7tbdPQTgrltMN8ek0pnbT6j3QrKx5iIZZ8dqD0kCdlSgAjnJCmFq8PBDFG5bvzjD08w4pGEHcCMVmOYm31ynNPOTvpA1rrxwA&usqp=CAE"
                alt="producttitle"
                width="150"
                height="150"
              />
            </div>
            <span class="product-subtitle"
              ><i class="fa-solid fa-layer-group"></i> Product Details</span
            >
            <table class="productoverview-table">
              <tr>
                <th>Product</th>
                <td>${this._data.productname}</td>
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
