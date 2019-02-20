'use strict';

const FILTERS_AREA = document.querySelector(`.main__filter`);
const CARDS_AREA = document.querySelector(`.board__tasks`);
const WEEKDAYS = [`mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`];
const COLORLIST = [`black`, `yellow`, `blue`, `green`, `pink`];

const renderFilterElement = (data) => {
  data.forEach((item) => {
    const {caption, amount, checked = false} = item;
    const elementTemplate = document.createElement(`template`);
    const createFilter =
    `
    <input
      type="radio"
      id="filter__${caption.toLowerCase()}"
      class="filter__input visually-hidden"
      name="filter"
      ${amount === 0 ? ` disabled` : ``}
      ${checked ? ` checked` : ``}
    />
    <label for="filter__${caption.toLowerCase()}" class="filter__label">
      ${caption.toUpperCase()} <span class="filter__${caption.toLowerCase()}-count">${amount}</span></label
    >`;

    elementTemplate.innerHTML = createFilter;
    FILTERS_AREA.appendChild(elementTemplate.content);
  });
};


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

renderFilterElement(filterElements);

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

const renderCardElement = (data) => {
  const {controls, color, date, id, repeatDays, hashtags = [], img, edit, text} = data;
  const elementTemplate = document.createElement(`template`);
  const cardElement = {};
  const repeatDaysCheck = repeatDays ? repeatDays : {};

  cardElement.control =
  `
  <div class="card__control">
    ${controls.map((item) => `
    <button type="button" class="card__btn card__btn--${item.toLowerCase()}">
      ${item.toLowerCase()}
    </button>`).join(``)}
</div>
  `;

  cardElement.colorBar =
  `
  <div class="card__color-bar">
    <svg class="card__color-bar-wave" width="100%" height="10">
      <use xlink:href="#wave"></use>
    </svg>
  </div>
  `;

  cardElement.textArea =
  `
  <div class="card__textarea-wrap">
  <label>
    <textarea
      class="card__text"
      placeholder="Start typing your text here..."
      name="text"
    >${text}</textarea>
  </label>
  </div>
  `;

  const settings = {};

  settings.details =
  `
  <div class="card__details">
    <div class="card__dates">
      <button class="card__date-deadline-toggle" type="button">
        date: <span class="card__date-status">${date ? `YES` : `NO`}</span>
      </button>
      <fieldset class="card__date-deadline" ${date ? `` : `disabled`}>
        <label class="card__input-deadline-wrap">
          <input
            class="card__date"
            type="text"
            placeholder="23 September"
            name="date"
            ${date ? `value="${date.day}"` : ``}
          />
        </label>
        <label class="card__input-deadline-wrap">
          <input
            class="card__time"
            type="text"
            placeholder="11:15 PM"
            name="time"
            ${date ? `value="${date.time}"` : ``}
          />
        </label>
      </fieldset>
      <button class="card__repeat-toggle" type="button">
        repeat:<span class="card__repeat-status">${repeatDays ? `YES` : `NO`}</span>
      </button>
      <fieldset class="card__repeat-days" ${repeatDays ? `` : `disabled`}>
        <div class="card__repeat-days-inner">
          ${WEEKDAYS.map((day) => `
            <input
              class="visually-hidden card__repeat-day-input"
              type="checkbox"
              id="repeat-${day}-${id}"
              name="repeat"
              value=${day}
              ${repeatDaysCheck[day] ? `checked` : ``}
            />
            <label class="card__repeat-day" for="repeat-${day}-${id}"
              >${day}</label
            >
          `).join(``)}
        </div>
      </fieldset>
    </div>
    <div class="card__hashtag">
      <div class="card__hashtag-list">
        ${hashtags.map((hashtag) => `
          <span class="card__hashtag-inner">
            <input
              type="hidden"
              name="hashtag"
              value="repeat"
              class="card__hashtag-hidden-input"
            />
            <button type="button" class="card__hashtag-name">
              #${hashtag}
            </button>
            <button type="button" class="card__hashtag-delete">
              delete
            </button>
          </span>
        `).join(``)}
      </div>
      <label>
        <input
          type="text"
          class="card__hashtag-input"
          name="hashtag-input"
          placeholder="Type new hashtag here"
        />
      </label>
    </div>
  </div>
  `;

  settings.img =
  `
    <label class="card__img-wrap ${img ? `` : `card__img-wrap--empty`} ">
      <input
        type="file"
        class="card__img-input visually-hidden"
        name="img"
      />
      <img
        src=" ${img ? `img` : `img/add-photo.svg`}"
        alt="task picture"
        class="card__img"
      />
    </label>
  `;

  settings.colors =
  `
    <div class="card__colors-inner">
      <h3 class="card__colors-title">Color</h3>
      <div class="card__colors-wrap">
        ${COLORLIST.map((el) => `
        <input
          type="radio"
          id="color-${el}-${id}"
          class="card__color-input card__color-input--${el} visually-hidden"
          name="color"
          value=${el}
          ${color === el ? `checked` : ``}
        />
        <label
          for="color-${el}-${id}"
          class="card__color card__color--${el}"
          >${el}</label
        >
        `).join(``)}
      </div>
    </div>
  `;

  cardElement.settings =
  `
  <div class="card__settings">
    ${settings.details}
    ${settings.img}
    ${settings.colors}
  </div>
  `;

  cardElement.statusBtns =
  `
  <div class="card__status-btns">
    <button class="card__save" type="submit">save</button>
    <button class="card__delete" type="button">delete</button>
  </div>
  `;

  const cardContent =
  `
  <article class="card ${edit ? `card--edit` : ``} ${repeatDays ? `card--repeat` : ``}">
    <form class="card__form" method="get">
      <div class="card__inner">
        ${cardElement.control}
        ${cardElement.colorBar}
        ${cardElement.textArea}
        ${cardElement.settings}
        ${cardElement.statusBtns}
      </div>
    </form>
  </article>
  `;

  elementTemplate.innerHTML = cardContent;
  CARDS_AREA.appendChild(elementTemplate.content);
};

const createCardElement = (cardsCount) => {
  let i = 0;
  while (i < cardsCount) {
    renderCardElement(cardData);
    i++;
  }
};
createCardElement(1);

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
