import {FILTERS_AREA} from './export-const.js';

export default (data) => {
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
