export default class View {
  _data;

  render(data, render = true) {
    console.log('TEST');
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    console.log(this._data);
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = ``;
  }
}
