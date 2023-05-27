import View from './View';

class ResetListView extends View {
  _parentElement = document.querySelector('.btn_removefilter');

  removeFilterBtnAndTag() {
    const menu = document.querySelector('.filter-menu');
    const filterTxt = document.querySelector('.filter-text');
    filterTxt.innerHTML = '';
    menu.style.visibility = 'hidden';
  }

  addHandlerResetList(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new ResetListView();
