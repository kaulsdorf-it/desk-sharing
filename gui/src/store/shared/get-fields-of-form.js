import { formComponents } from '../form-components'
import { EnumFormComponentUseCase } from '../enums/component-use-case'

export const getFieldsOfForm = (form, useCase) => {
  if (!form) {
    return []
  }

  const getNodes = node => node.values ? [node, ...node.values.map(i => getNodes(i))] : [node]

  let types

  switch (useCase) {
    case EnumFormComponentUseCase.useAsConditionTarget:
      types = formComponents.filter(i => i.canBeUsedAsConditionTarget).map(i => i.type)
      break
    case EnumFormComponentUseCase.useInCondition:
      types = formComponents.filter(i => i.canBeUsedInCondition).map(i => i.type)
      break
    case 'all':
      types = formComponents.map(i => i.type)
      break
    default:
      types = []
  }

  const filterInputFields = value => types.indexOf(value.type) !== -1

  const test = form
    .definition
    .values
    .map(i => getNodes(i))
    .flat(10)
    .filter(filterInputFields)

  return test
}
