export default (data) => {
  if (data.getMinutes() < 10) {
    return `0${data.getMinutes()}`;
  } else {
    return `${data.getMinutes()}`;
  }
};
