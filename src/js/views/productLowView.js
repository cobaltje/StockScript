import View from './View';

class productLowView extends View {
  _parentElement = document.querySelector('.lowonstockproducts-list');

  renderLowProduct(data, render = true) {
    this._data = data;
    const markup = this._generateMarkup(data);
    if (!render) return markup;
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  _generateMarkup() {
    return `
    <div class="preview">
      <img src="${this._data.imageurl}" alt="${this._data.productname}" height="48" width="48" />
      <div class="preview_data">
        <p>${this._data.productname}</p>
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
