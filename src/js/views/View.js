import { controlProductActions } from '../controller';

export default class View {
  _data;

  renderList(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;

    const markup = this._generateMarkup(data);

    if (!render) return markup;

    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = ``;
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
