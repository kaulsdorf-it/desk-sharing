export const replaceElementByText = (content, searchFor, replaceByString) => {
  const { elementName, attributes } = searchFor

  let response = ''

  // determine element's start tag
  const elementOpenStartsAt = content.indexOf('<' + elementName)

  if (elementOpenStartsAt === -1) {
    return content
  }

  const elementOpenEndsAt = content.indexOf('>', elementOpenStartsAt)

  if (elementOpenEndsAt === -1) {
    return content
  }

  // determine element's closing tag
  const endTag = '<' + elementName.slice(0, 0) + '/' + elementName.slice(0) + '>'

  const elementCloseStartsAt = content.indexOf(endTag, elementOpenEndsAt)

  if (elementCloseStartsAt === -1) {
    return content
  }

  const elementCloseEndsAt = content.indexOf('>', elementCloseStartsAt)

  if (elementCloseEndsAt === -1) {
    return content
  }

  // determine if all mentioned attributes with their corresponding values match found element
  const doAllAttributesMatch = () => {
    if (attributes && Array.isArray(attributes)) {
      const elementOpen = content.substr(elementOpenStartsAt, elementOpenEndsAt + 1 - elementOpenStartsAt)

      return attributes
        .map(attribute => `${attribute.name}="${attribute.value}"`)
        .every(attributeString => elementOpen.indexOf(attributeString) !== -1)
    }

    return true
  }

  if (!doAllAttributesMatch()) {
    response += content.substr(0, elementCloseEndsAt + 1)
  } else {
    response += content.substr(0, elementOpenStartsAt) + replaceByString
  }

  response += replaceElementByText(content.substr(elementCloseEndsAt + 1), searchFor, replaceByString)

  return response
}
