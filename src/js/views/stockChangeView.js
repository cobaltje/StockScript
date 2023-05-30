import View from './View';

class stockChangeView extends View {
  _parentElement = document.querySelector('.stockcalcresults-content-overview');
  _stockCalcResultsElement = document.querySelector('.stockcalcresults');
  _productTableElement = document.querySelector('.productlist');
  _message;
  _messageSuccessfull =
    'The stock has succesfull changed on the following items:';
  _messageFailed = 'There was not enough stock on the following items:';
  _messageMin =
    'The following items have reached or went below the minimum amount:';
  _messageMax = 'The following items have more stock then the set maximum:';
  _status;
  _icon;
  _productlist;

  createResultsScreen(valid, invalid, min, max) {
    // Clean previous results
    this._parentElement.innerHTML = '';

    if (valid.length > 0)
      this._generateMarkupStatus(
        this._messageSuccessfull,
        'Succesfull',
        'fa-circle-check',
        valid
      );

    if (invalid.length > 0)
      this._generateMarkupStatus(
        this._messageFailed,
        'Failed',
        'fa-circle-xmark',
        invalid
      );

    if (min.length > 0)
      this._generateMarkupStatus(this._messageMin, 'Min', 'fa-minimize', min);
    if (max.length > 0)
      this._generateMarkupStatus(this._messageMax, 'Max', 'fa-maximize', max);

    // Switch to stockchanges results screen
    this._stockCalcResultsElement.classList.remove('hidden');
    this._productTableElement.classList.add('hidden');
  }

  _generateMarkupStatus(message, status, icon, products) {
    this._status = status;
    this._message = message;
    this._icon = icon;
    this._productlist = products;
    let markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  _generateMarkup() {
    return `
  
    <div class="stockcalcresults-content stockcalcresults-content-${this._status.toLowerCase()}">
      <h3><i class="fa-solid ${
        this._icon
      } icon-${this._status.toLowerCase()}"></i> ${this._status}</h3>
      <div class="stockcalcresults-content-content-message">${this._message}
        <ul>
          ${this._productlist
            .map(function (product) {
              return `<li>${product}</li>`;
            })
            .join('')}
        </ul>
      </div>
    </div>
          
    `;
  }
}

export default new stockChangeView();
