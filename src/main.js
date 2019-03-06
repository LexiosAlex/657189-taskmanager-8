import {FILTERS_AREA, CARDS_AREA, WEEKDAYS, COLORLIST} from './export-const.js';
import renderFilter from './render-filter.js';
import Task from './render-card-element.js';
import TaskEdit from './task-edit.js';

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
      id: 51,
    };
    randomCardsData[i] = cardData;
  }
  return randomCardsData;
};

const createCardElement = (cardsCount) => {
  const randomCardsData = getRandomCardsData(cardsCount);
  randomCardsData.forEach((it) => {
    let taskComponent = new Task(it);
    let editTaskComponent = new TaskEdit(it);

    CARDS_AREA.appendChild(taskComponent.render());

    taskComponent.onEdit = () => {
      editTaskComponent.render();
      CARDS_AREA.replaceChild(editTaskComponent.element, taskComponent.element);
      taskComponent.unrender();
    };

    editTaskComponent.onEdit = () => {
      taskComponent.render();
      CARDS_AREA.replaceChild(taskComponent.element, editTaskComponent.element);
      editTaskComponent.unrender();
    };

    editTaskComponent.onSubmit = () => {
      taskComponent.render();
      CARDS_AREA.replaceChild(taskComponent.element, editTaskComponent.element);
      editTaskComponent.unrender();
    };
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

FILTERS_AREA.querySelectorAll(`.filter__input`).forEach((item) => {
  item.addEventListener(`click`, () => {
    removeCards();
    addRandomCardsAmount();
  });
});
