import View from './View';
import productListView from './productListView';

class ProductsView extends View {
  renderProducts(products, query = '') {
    const productsToRender = [];
    if (query !== '') {
      products.map(product => {
        if (product.productname.toLowerCase().includes(query)) {
          productsToRender.push(product);
        }
      });
    } else {
      products.map(product => productsToRender.push(product));
    }

    productsToRender.map(product => {
      productListView.renderList(product);
    });
  }

  displayFilterButton(query) {
    const menu = document.querySelector('.filter-menu');
    const filterTxt = document.querySelector('.filter-text');
    menu.style.visibility = 'visible';
    filterTxt.innerHTML = `<i class="fa-solid fa-tag"></i> ${query}`;
  }
}

export default new ProductsView();
