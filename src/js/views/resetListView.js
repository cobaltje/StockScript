import view from './view.js';

class ResetListView extends view {
  _parentElement = document.querySelector('.tablefunctions');

  addHandlerResetList(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new ResetListView();
