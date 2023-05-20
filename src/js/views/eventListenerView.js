import { controlActions } from '../controller';

class EventView {
  actionEventListeners() {
    document.addEventListener('click', controlActions);
  }
}

export default new EventView();
