import {WEEKDAYS, COLORLIST, MONTHLIST} from './export-const.js';
import getUTCHours from './get-utc-hours.js';
import getUTCMinutes from './get-utc-minutes.js';
import Component from './component.js';

export default class TaskEdit extends Component {
  constructor(task) {
    super();
    this._color = task.color;
    this._date = task.date;
    this._repeatDays = task.repeatDays;
    this._hashtags = task.hashtags;
    this._img = task.img;
    this._title = task.title;
    this._element = null;
    this._id = task.id;

    this._state = {
      isFavorite: false,
      isDone: false,
      isOutDated: false,
    };

    this._element = null;
    this._onSubmit = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    return typeof this._onSubmit === `function` && this._onSubmit();
  }

  _isRepeated() {
    return Object.values(this._repeatingDays).some((it) => it === true);
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  _onEditButtonClick() {
    return typeof this._onEdit === `function` && this._onEdit();
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  _isRepeated() {
    return Object.values(this._repeatDays).some((it) => it === true);
  }

  get template() {
    const convertedDate = new Date(this._date);
    const repeatDaysCheck = this._repeatDays ? this._repeatDays : {};
    const today = Date.now();
    if (today > this._date) {
      this._state.isOutDated = true;
    }

    const cardElement = {};
    cardElement.control =
    `
    <div class="card__control">
      <button type="button" class="card__btn card__btn--edit">
        edit
      </button>
      <button type="button" class="card__btn card__btn--archive">
        archive
      </button>
      <button
        type="button"
        class="card__btn card__btn--favorites ${this._state.isFavorite ? `` : `card__btn--disabled`}"
      >
        favorites
      </button>
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
      >${this._title ? `${this._title}` : ``}</textarea>
    </label>
    </div>
    `;

    const settings = {};
    settings.details =
    `
    <div class="card__details">
      <div class="card__dates">
        <button class="card__date-deadline-toggle" type="button">
          date: <span class="card__date-status">${this._date ? `YES` : `NO`}</span>
        </button>
        <fieldset class="card__date-deadline" ${this._date ? `` : `disabled`}>
          <label class="card__input-deadline-wrap">
            <input
              class="card__date"
              type="text"
              placeholder="23 September"
              name="date"
              ${this._date ? `value="${convertedDate.getDate()} ${MONTHLIST[convertedDate.getMonth()].toUpperCase()}"` : ``}
            />
          </label>
          <label class="card__input-deadline-wrap">
            <input
              class="card__time"
              type="text"
              placeholder="11:15 PM"
              name="time"
              ${this._date ? `value="${convertedDate.getHours()}:${getUTCMinutes(convertedDate)} ${getUTCHours(convertedDate)}"` : ``}
            />
          </label>
        </fieldset>
        <button class="card__repeat-toggle" type="button">
          repeat:<span class="card__repeat-status">${this._repeatDays ? `YES` : `NO`}</span>
        </button>
        <fieldset class="card__repeat-days" ${this._repeatDays ? `` : `disabled`}>
          <div class="card__repeat-days-inner">
            ${WEEKDAYS.map((day) => `
              <input
                class="visually-hidden card__repeat-day-input"
                type="checkbox"
                id="repeat-${day}-${this._id}"
                name="repeat"
                value=${day}
                ${repeatDaysCheck[day] ? `checked` : ``}
              />
              <label class="card__repeat-day" for="repeat-${day}-${this._id}"
                >${day}</label
              >
            `).join(``)}
          </div>
        </fieldset>
      </div>
      <div class="card__hashtag">
        <div class="card__hashtag-list">
          ${[...this._hashtags].map((hashtag) => `
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
      <label class="card__img-wrap ${this._img ? `` : `card__img-wrap--empty`} ">
        <input
          type="file"
          class="card__img-input visually-hidden"
          name="img"
        />
        <img
          src=" ${this._img ? `${this._img}` : `img/add-photo.svg`}"
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
            id="color-${el}-${this._id}"
            class="card__color-input card__color-input--${el} visually-hidden"
            name="color"
            value=${el}
            ${this._color === el ? `checked` : ``}
          />
          <label
            for="color-${el}-${this._id}"
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
    <article class="card card--edit ${this._isRepeated() ? `card--repeat` : ``} card--${this._color} ${this._state.isOutDated ? `card--deadline` : ``} ${this._stateisDone ? `card--done` : ``}">
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

    return cardContent.trim();
  }

  bind() {
    this._element.querySelector(`.card__form`)
      .addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__btn--edit`)
      .addEventListener(`click`, this._onEditButtonClick);
  }

  unbind() {
    this._element.querySelector(`.card__form`)
      .removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__btn--edit`)
      .removeEventListener(`click`, this._onEditButtonClick);
  }

}
