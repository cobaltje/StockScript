import View from './View';

class newProductView extends View {
  _parentElement = document.querySelector('.productlist');
  _productOverview = document.querySelector('.productoverview');

  renderNewProductView(windowActive) {
    // Remove open productView.
    if (windowActive) {
      this._productOverview.remove();
    }

    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML('afterend', markup);
  }

  _generateMarkup() {
    return `
    <div class="productoverview">
      <div class="productoverview-heading">
        <i class="fa-solid fa-folder-open productoverview-title-icon"></i>
        <span class="product-title">Create new product</span>
        <i class="fa-solid fa-circle-xmark product-close"></i>
      </div>
      <div class="productoverview-content">
        <form>
          <label for="productname">Productname</label><br>
          <input class="editproductinput" type="text" id="productname" name="productname"><br>
          <label for="stocklocation">Stocklocation</label><br>
          <input class="editproductinput" type="text" id="stocklocation" name="stocklocation"><br>
          <label for="imageurl">Picture URL</label><br>
          <input class="editproductinput" type="url" id="imageurl" name="imageurl">
        </form>
      </div>
    </div>
    `;
  }
}

export default new newProductView();
