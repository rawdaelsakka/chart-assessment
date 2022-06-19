export function prepareData(arrValue) {
  return [...new Set(arrValue)].map((el, i) => {
    return { key: i, value: el };
  });
}
