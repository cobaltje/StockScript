import View from './view.js';

class ResetListView extends View {
  _parentElement = document.querySelector('.btn_removefilter');

  addHandlerResetList(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new ResetListView();
