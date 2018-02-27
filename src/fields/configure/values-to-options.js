export default (values) => {
  if (values instanceof Array) {
    return values.map(e => ({ key: e, value: e }));
  }
  if (typeof values === 'object') {
    return values.map(e => ({ key: e, value: e }));
  }
  return [{}];
};
