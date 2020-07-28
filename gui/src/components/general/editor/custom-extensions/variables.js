import { Node } from 'tiptap'
import { replaceText } from 'tiptap-commands'
import VariableSuggestionPlugin from './plugins/variable-suggestion'

export default class Variables extends Node {
  get name() {
    return 'variable'
  }

  get defaultOptions() {
    return {
      matcher: {
        char: '',
        allowSpaces: false,
        startOfLine: false
      },
      variableClass: 'variable',
      suggestionClass: 'variable-suggestion'
    }
  }

  get schema() {
    return {
      attrs: {
        target: {},
        label: {}
      },
      group: 'inline',
      inline: true,
      selectable: false,
      atom: true,
      toDOM: node => [
        'span',
        { class: this.options.variableClass, 'data-variable-target': node.attrs.target },
        `${this.options.matcher.char}${node.attrs.label}`
      ],
      parseDOM: [
        {
          tag: 'span[data-variable-target]',
          getAttrs: dom => {
            const target = dom.getAttribute('data-variable-target')
            const label = dom.innerText
              .split(this.options.matcher.char)
              .join('')
            return { target, label }
          }
        }
      ]
    }
  }

  get plugins() {
    return [
      VariableSuggestionPlugin({
        command: ({ range, attrs, schema }) =>
          replaceText(range, schema.nodes[this.name], attrs),
        appendText: ' ',
        matcher: this.options.matcher,
        items: this.options.items,
        onEnter: this.options.onEnter,
        onChange: this.options.onChange,
        onExit: this.options.onExit,
        onKeyDown: this.options.onKeyDown,
        onFilter: this.options.onFilter,
        suggestionClass: this.options.suggestionClass
      })
    ]
  }

  commands({ schema }) {
    return attrs => replaceText(null, schema.nodes[this.name], attrs)
  }
}
