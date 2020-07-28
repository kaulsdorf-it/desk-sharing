export const sortByField = (fieldName, dataType) => (a, b) => {
  if (dataType.toLowerCase() === 'number') {
    return a[fieldName] < b[fieldName]
  } else {
    return a[fieldName].localeCompare(b[fieldName])
  }
}
