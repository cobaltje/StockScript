import View from './View';

class productLowView extends View {
  _parentElement = document.querySelector('.lowonstockproducts-list');

  renderLowProduct(data, render = true) {
    this._data = data;
    let markup;
    if (this._data === 'empty') {
      markup = this._generateMarkupEmpty();
    } else {
      markup = this._generateMarkup(data);
    }

    if (!render) return markup;
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  controlLowOnStock(products) {
    const productsLow = [];
    for (let i = 0; i <= products.length - 1; i++) {
      if (
        products[i].stock <= products[i].minimumstock &&
        products[i].stock !== products[i].maximumstock
      )
        productsLow.push(products[i]);
    }
    if (productsLow.length === 0) this.renderLowProduct('empty');
    productsLow.map(product => {
      this.renderLowProduct(product);
    });
  }

  _generateMarkupEmpty() {
    return `
    <div class="preview">
      <div class="preview_data">
      <p><i class="fa-regular fa-thumbs-up"></i></p>
      <p>There are no products low on stock!</p>
      </div>
    </div>
    `;
  }

  _generateMarkup() {
    return `
    <div class="preview" data-productid="${this._data.id}">
      <div class="preview_data">
        <img src="${this._data.imageurl}" alt="${this._data.productname}" height="48" width="48" />
        <h6>${this._data.productname}</h6>
        <span class="preview_data_stock">
          <p><i class="fa-solid fa-inbox"></i> ${this._data.stock} </p>
          <p><i class="fa-solid fa-triangle-exclamation"></i> ${this._data.minimumstock}</p>
          <p><i class="fa-solid fa-fill-drip"></i> ${this._data.maximumstock}</p>
        </span>
      </div>
    </div>
     `;
  }
}

export default new productLowView();
