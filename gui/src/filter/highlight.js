export const textHighlight = (content, searchString) => {
  if (!content || content.toString().length === 0) {
    return ''
  }

  if (content instanceof Date) {
    return content
  }

  if (!searchString || searchString.toString().length < 1) {
    return content !== true ? content : ''
  }

  const expression = new RegExp(searchString, 'gi')
  content = typeof content !== 'string' ? content.toString() : content

  return content.replace(expression, match => '<span class="highlight-text">' + match + '</span>')
}
