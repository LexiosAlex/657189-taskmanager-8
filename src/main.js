import {FILTERS_AREA, CARDS_AREA, WEEKDAYS} from './export-const.js';
import renderFilter from './render-filter.js';
import renderCardElement from './render-card-element.js';

const filterElements = [
  {
    caption: `All`,
    amount: 15,
    checked: true
  },
  {
    caption: `overdue`,
    amount: 0,
  },
  {
    caption: `today`,
    amount: 0,
  },
  {
    caption: `favorites`,
    amount: 7
  },
  {
    caption: `repeating`,
    amount: 2
  },
  {
    caption: `tags`,
    amount: 6
  },
  {
    caption: `archive`,
    amount: 115
  },
];

renderFilter(filterElements);

const cardData = {
  controls: [`edit`, `archive`, `favorites`],
  color: `blue`,
  weekdays: [`sun`, `mon`, `tue`, `wed`, `thu`, `fri`, `sat`],
  id: 51,
  repeatDays: {
    [WEEKDAYS[2]]: true
  },
  edit: true,
  text: `agsagsagda`,
  hashtags: [`great`, `endlessHate`]
};

const createCardElement = (cardsCount) => {
  for (let i = 0; i < cardsCount; i++) {
    renderCardElement(cardData);
  }
};
createCardElement(7);

const removeCards = () => {
  let cardsArray = CARDS_AREA.querySelectorAll(`.card`);
  cardsArray.forEach((item) => {
    CARDS_AREA.removeChild(item);
  });
};

const addRandomCardsAmount = () => {
  createCardElement(Math.floor(Math.random() * 10));
};

const filtersListener = () => {
  FILTERS_AREA.querySelectorAll(`.filter__input`).forEach((item) => {
    item.addEventListener(`click`, () => {
      removeCards();
      addRandomCardsAmount();
    });
  });
};
filtersListener();
