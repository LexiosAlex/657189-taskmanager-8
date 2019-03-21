import {WEEKDAYS, COLORLIST} from './export-const.js';
import Component from './component.js';
import moment from 'moment';
import flatpickr from 'flatpickr';

export default class TaskEdit extends Component {
  constructor(task) {
    super();
    this._color = task.color;
    this._dueDate = task.dueDate;
    this._repeatingDays = task.repeatDays;
    this._hashtags = task.hashtags;
    this._img = task.img;
    this._title = task.title;
    this._element = null;
    this._id = task.id;

    this._state = {
      isDate: false,
      isFavorite: false,
      isDone: false,
      isOutDated: false,
      isRepeated: false,
    };

    this._datePicker = null;
    this._timePicker = null;
    this._element = null;
    this._onSubmit = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onEditButtonClick = this._onEditButtonClick.bind(this);

    this._onChangeDate = this._onChangeDate.bind(this);
    this._onChangeRepeated = this._onChangeRepeated.bind(this);
  }

  _getChangedTime() {
    const aditionalDays = this._datePicker.selectedDates[0] - this._dueDate;
    const aditionalTime = this._timePicker.selectedDates[0] - this._dueDate;
    return this._dueDate + aditionalDays + aditionalTime;
  }

  _onChangeDate() {
    this._state.isDate = !this._state.isDate;
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _removeClandar() {
    while (document.querySelector(`.flatpickr-calendar`)) {
      document.querySelector(`.flatpickr-calendar`).remove();
    }
  }

  _onChangeRepeated() {
    this._state.isRepeated = !this._state.isRepeated;
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _processForm(formData) {
    const entry = {
      title: ``,
      color: ``,
      dueDate: this._getChangedTime(),
      hashtags: new Set(),
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      }
    };

    const taskEditMapper = TaskEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (typeof taskEditMapper[property] === `function`) {
        taskEditMapper[property](value);
      }
    }

    return entry;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.card__form`));
    const newData = this._processForm(formData);
    this._getChangedTime();
    this.update(newData);
    this._removeClandar();
    return typeof this._onSubmit === `function` && this._onSubmit(newData);
  }

  _isRepeated() {
    if (this._repeatingDays) {
      return Object.values(this._repeatingDays).some((it) => it === true);
    }
    return false;
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

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  stateUpdate() {
    if (Date.now() > this._dueDate) {
      this._state.isOutDated = true;
    }

    if (Object.values(this._repeatingDays).some((it) => it === true)) {
      this._state.isRepeated = true;
    }

    if (this._dueDate) {
      this._state.isDate = true;
    }
  }

  get template() {
    const repeatDaysCheck = this._repeatingDays ? this._repeatingDays : {};

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
          date: <span class="card__date-status">${this._state.isDate ? `YES` : `NO`}</span>
        </button>
        <fieldset class="card__date-deadline" ${this._state.isDate ? `` : `disabled`}>
          <label class="card__input-deadline-wrap">
            <input
              class="card__date"
              type="text"
              placeholder="23 September"
              name="date"
              ${this._dueDate ? `value="${moment.unix(this._dueDate / 1000).format(`DD MMMM`)}"` : ``}
            />
          </label>
          <label class="card__input-deadline-wrap">
            <input
              class="card__time"
              type="text"
              placeholder="11:15 PM"
              name="time"
              ${this._dueDate ? `value="${moment.unix(this._dueDate / 1000).format(`LT`)}"` : ``}
            />
          </label>
        </fieldset>
        <button class="card__repeat-toggle" type="button">
          repeat:<span class="card__repeat-status">${this._state.isRepeated ? `YES` : `NO`}</span>
        </button>
        <fieldset class="card__repeat-days" ${this._state.isRepeated ? `` : `disabled`}>
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
                value="${hashtag}"
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
    this._element.querySelector(`.card__date-deadline-toggle`)
        .addEventListener(`click`, this._onChangeDate);
    this._element.querySelector(`.card__repeat-toggle`)
        .addEventListener(`click`, this._onChangeRepeated);
    if (this._state.isDate) {
      this._datePicker = flatpickr(this._element.querySelector(`.card__date`), {altInput: true, altFormat: `j F`, dateFormat: `j F`});
      this._timePicker = flatpickr(this._element.querySelector(`.card__time`), {enableTime: true, noCalendar: true, altInput: true, altFormat: `h:i K`, dateFormat: `h:i K`});
    }
  }

  unbind() {
    this._element.querySelector(`.card__form`)
      .removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__btn--edit`)
      .removeEventListener(`click`, this._onEditButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`)
      .removeEventListener(`click`, this._onChangeDate);
    this._element.querySelector(`.card__repeat-toggle`)
      .removeEventListener(`click`, this._onChangeRepeated);
  }

  update(data) {
    this._title = data.title;
    this._hashtags = data.hashtags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;

  }

  static createMapper(target) {
    return {
      hashtag: (value) => target.hashtags.add(value),
      text: (value) => {
        target.title = value;
      },
      color: (value) => {
        target.color = value;
      },
      repeat: (value) => {
        target.repeatingDays[value] = true;
      },
    };
  }

}
