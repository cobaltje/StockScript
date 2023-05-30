import View from './View';
import { DATA_OPTIONS } from '../config';

class MovementsView extends View {
  _parentElement = document.querySelector('.movements-table-data');

  renderMovements(movements) {
    movements.map(movement => this.renderList(movement));
  }

  _generateMarkup() {
    const date = new Date(this._data.created_at);
    return `
    <tr class="movements-row">
      <td>${date.toLocaleDateString(navigator.language, DATA_OPTIONS)}</td>
      <td>${this._data.prevstockamount}</td>
      <td>${
        this._data.changestockamount > 0
          ? `<i class="fa-sharp fa-solid fa-arrow-up"></i>`
          : `<i class="fa-sharp fa-solid fa-arrow-down"></i>`
      } ${Math.abs(this._data.changestockamount)}</td>
      <td>${this._data.newstockamount}</td>
    </tr>
    `;
  }
}

export default new MovementsView();
