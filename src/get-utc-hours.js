export default (data) => {
  if (data.getHours() > 12) {
    return `PM`;
  } else {
    return `AM`;
  }
};
