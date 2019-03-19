import Component from './component.js';
const moment = require(`moment`);

export default class Task extends Component {
  constructor(task) {
    super();
    this._color = task.color;
    this._dueDate = task.dueDate;
    this._repeatingDays = task.repeatDays;
    this._hashtags = task.hashtags;
    this._img = task.img;
    this._title = task.title;
    this._id = task.id;
    this._element = null;

    this._state = {
      isDate: false,
      isFavorite: false,
      isDone: false,
      isOutDated: false,
    };

    this._onEdit = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
  }

  _isRepeated() {
    if (this._repeatingDays) {
      return Object.values(this._repeatingDays).some((it) => it === true);
    }
    return false;
  }

  _onEditButtonClick() {
    return typeof this._onEdit === `function` && this._onEdit();
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  stateUpdate() {
    if (Date.now() > this._dueDate) {
      this._state.isOutDated = true;
    }

    if (Date.now() > this._dueDate) {
      this._state.isOutDated = true;
    }

    if (this._repeatingDays) {
      this._state.isRepeated = true;
    }

    if (this._dueDate) {
      this._state.isDate = true;
    }
  }

  get template() {
    this.stateUpdate();

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
          repeat:<span class="card__repeat-status">${this._repeatingDays ? `YES` : `NO`}</span>
        </button>
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

    cardElement.settings =
    `
    <div class="card__settings">
      ${settings.details}
      ${settings.img}
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
    <article class="card ${this._isRepeated() ? `card--repeat` : ``} card--${this._color} ${this._state.isOutDated ? `card--deadline` : ``} ${this._stateisDone ? `card--done` : ``}">
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
    this._element.querySelector(`.card__btn--edit`)
        .addEventListener(`click`, this._onEditButtonClick);
  }

  unbind() {
    this._element.querySelector(`.card__btn--edit`)
      .removeEventListener(`click`, this._onEditButtonClick);
  }

  update(data) {
    this._title = data.title;
    this._hashtags = data.hashtags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
  }

}
