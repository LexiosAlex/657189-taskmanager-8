import {FILTERS_AREA, CARDS_AREA, WEEKDAYS, COLORLIST} from './export-const.js';
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

const getRandomCardsData = (count) => {
  const randomCardsData = [];
  for (let i = 0; i < count; i++) {
    let cardData = {
      color: COLORLIST[Math.floor(Math.random() * COLORLIST.length)],
      id: 51,
      repeatDays: {
        [WEEKDAYS[2]]: true
      },
      hashtags: new Set([
        `cinema`,
        `entertainment`,
        `myself`,
        `cinema`,
      ]),
      img: `//picsum.photos/100/100?r=${Math.random()}`,
      title: [
        `Learn the theory`,
        `Do homework`,
        `Do the 100% intensive`,
      ][Math.floor(Math.random() * 3)],
      date: Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
      isFavorite: false,
      isDone: false,
    };
    randomCardsData[i] = cardData;
  }
  return randomCardsData;
};


const createCardElement = (cardsCount) => {
  const randomCardsData = getRandomCardsData(cardsCount);
  randomCardsData.forEach((it) => {
    renderCardElement(it);
  });
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
