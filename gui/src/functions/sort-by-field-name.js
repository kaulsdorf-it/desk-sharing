import moment from 'moment'

export const sortByFieldName = (list, sorting) => {
  const name = sorting.fieldName

  let asc
  let desc
  if (sorting.sortOrder === -1) {
    asc = -1
    desc = 1
  } else {
    asc = 1
    desc = -1
  }

  switch (sorting.dataType) {
    case 'string':
      return list.sort((a, b) => {
        if (!a[name]) {
          return asc
        }
        if (!b[name]) {
          return desc
        }
        const compare = a[name].localeCompare(b[name])
        if (compare === 1) {
          return desc
        }
        return asc
      })
    default:
      return list.sort((a, b) => {
        if (!a[name]) {
          return asc
        }
        if (!b[name]) {
          return desc
        }
        if (a[name] === b[name]) {
          return 0
        }
        if (a[name] > b[name]) {
          return desc
        }
        return asc
      })
  }
}

export const sortByFieldSorter = (field, reverse, dataTye) => {
  let keyFc

  switch (dataTye) {
    case Date:
      keyFc = x => x && x[field] ? moment(x[field]).format('X') : 0
      break
    case String:
      keyFc = x => x && x[field] ? x[field].toString().toLowerCase() : ''
      break
    case Number:
    default:
      keyFc = x => x && x[field] ? parseFloat(x[field]) : 0
      break
  }

  reverse = !reverse ? 1 : -1

  return (a, b) => {
    a = a ? keyFc(a) : 0
    b = b ? keyFc(b) : 0

    return reverse * ((a > b) - (b > a))
  }
}
