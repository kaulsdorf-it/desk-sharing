<template>
  <div class="editor">
    <v-form @submit.prevent="() => {}">
      <editor-menu-bar :editor="editor" class="menubar" v-slot="{ commands, isActive }">
        <div>
          <template
            v-for="(menuItem, idx) of menuItems"
          >
            <button
              :class="{ 'grey lighten-1': menuItem.checkFor ? isActive[menuItem.checkFor](menuItem.param) : false }"
              :key="idx"
              @click="commands[menuItem.command]()"
              v-if="!menuItem.items"
            >
              <v-icon>{{ menuItem.icon }}</v-icon>
            </button>

            <v-menu
              :key="idx"
              offset-y
              open-on-hover
              v-else
            >
              <template v-slot:activator="{ on }">
                <button
                  v-on="on"
                >
                  <v-icon>{{ menuItem.icon }}</v-icon>
                  <v-icon>mdi-chevron-down</v-icon>
                </button>
              </template>

              <v-list
                :key="idx"
                dense
              >
                <v-list-item
                  :key="idx"
                  @click="commands[item.command](item.param ? item.param : {})"
                  dense
                  v-for="(item, idx) of menuItem.items"
                  v-if="item.show ? isActive[item.show](item.param ? item.param : {}) : true"
                >
                  <v-list-item-action v-if="item.icon">
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-action>
                  <v-list-item-content v-if="item.label">{{ item.label }}</v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </div>
      </editor-menu-bar>
      <editor-content :editor="editor" class="editor__content"/>
    </v-form>
  </div>
</template>

<script>
  import { replaceElementByText } from '../../../functions/find-xml-element-and-replace'
  import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from 'tiptap/dist/tiptap.esm'
  import {
    Blockquote,
    Bold,
    BulletList,
    Code,
    CodeBlock,
    HardBreak,
    Heading,
    History,
    Italic,
    Link,
    ListItem,
    OrderedList,
    Strike,
    Table,
    TableCell,
    TableHeader,
    TableRow,
    TodoItem,
    TodoList,
    Underline,
  } from 'tiptap-extensions'

  import Variables from './custom-extensions/variables'

  export default {
    beforeDestroy() {
      this.editor.destroy()
    },

    components: {
      EditorContent,
      EditorMenuBar,
      EditorMenuBubble,
    },

    data() {
      return {
        localJSON: '',
        localHTML: '',
        editor: new Editor({
          extensions: [
            new Variables(),
            new Blockquote(),
            new CodeBlock(),
            new HardBreak(),
            new Heading({ levels: [1, 2, 3] }),
            new OrderedList(),
            new BulletList(),
            new ListItem(),
            new TodoItem(),
            new TodoList(),
            new Bold(),
            new Code(),
            new Italic(),
            new Link(),
            new Strike(),
            new Underline(),
            new History(),
            new Table({ resizable: true }),
            new TableRow(),
            new TableCell(),
            new TableHeader(),
          ],
          onUpdate: ({ getHTML, getJSON }) => {
            this.localHTML = this.replaceVariablesBySampleData(getHTML())
            this.localJSON = getJSON()

            const content = getHTML()
            const response = content.substr(3, content.length - 7)
            this.$emit('set', response)
            this.$emit('updateTemplateObject', getJSON())
          },
          content: this.content,
        }),
        menuItems: [
          {
            icon: 'mdi-format-header-pound',
            items: [
              { command: 'heading', icon: 'mdi-format-header-1', param: { level: 1 }, checkFor: 'heading' },
              { command: 'heading', icon: 'mdi-format-header-2', param: { level: 2 }, checkFor: 'heading' },
              { command: 'heading', icon: 'mdi-format-header-3', param: { level: 3 }, checkFor: 'heading' },
              { command: 'heading', icon: 'mdi-format-header-4', param: { level: 4 }, checkFor: 'heading' },
              { command: 'heading', icon: 'mdi-format-header-5', param: { level: 5 }, checkFor: 'heading' },
            ],
          },
          { command: 'bold', icon: 'mdi-format-bold' },
          { command: 'italic', icon: 'mdi-format-italic' },
          { command: 'underline', icon: 'mdi-format-underline' },
          { command: 'strike', icon: 'mdi-format-strikethrough-variant' },
          { command: 'ordered_list', icon: 'mdi-format-list-numbered' },
          { command: 'bullet_list', icon: 'mdi-format-list-bulleted' },
          { command: 'code', icon: 'mdi-code-brackets' },
          {
            icon: 'mdi-textbox',
            items: this.fields.map(field => ({
              command: 'variable',
              label: field.label,
              param: field,
              checkFor: 'variable',
              icon: field.icon,
            }))
          },
          { command: 'undo', icon: 'mdi-undo' },
          { command: 'redo', icon: 'mdi-redo' },
          {
            icon: 'mdi-table',
            items: [
              {
                command: 'createTable',
                icon: 'mdi-table-plus',
                checkFor: 'table',
                label: 'Tabelle einfügen',
              },
              {
                command: 'addColumnBefore',
                icon: 'mdi-table-column-plus-before',
                checkFor: 'table',
                show: 'table',
                label: 'neue Spalte vor aktueller einfügen',
              },
              {
                command: 'addColumnAfter',
                icon: 'mdi-table-column-plus-after',
                checkFor: 'table',
                show: 'table',
                label: 'neue Spalte nach aktueller einfügen',
              },
              {
                command: 'deleteColumn',
                icon: 'mdi-table-column-remove',
                checkFor: 'table',
                show: 'table',
                label: 'Aktuelle Spalte löschen',
              },
              {
                command: 'addRowBefore',
                icon: 'mdi-table-row-plus-before',
                checkFor: 'table',
                show: 'table',
                label: 'Zeile oberhalb einfügen',
              },
              {
                command: 'addRowAfter',
                icon: 'mdi-table-row-plus-after',
                checkFor: 'table',
                show: 'table',
                label: 'Zeile unterhalb einfügen',
              },
              {
                command: 'deleteRow',
                icon: 'mdi-table-row-remove',
                checkFor: 'table',
                show: 'table',
                label: 'Zeile löschen',
              },
              {
                command: 'toggleCellMerge',
                icon: 'mdi-table-merge-cells',
                checkFor: 'table',
                show: 'table',
                label: 'Zellen verbinden',
              },
              {
                command: 'deleteTable',
                icon: 'mdi-delete-forever-outline',
                checkFor: 'table',
                show: 'table',
                label: 'Tabelle löschen',
              },
            ],
          },
        ],
      }
    },

    methods: {
      test(data) {
      },
      replaceVariablesBySampleData(content) {
        this.fields.forEach(field => {
          const searchFor = {
            elementName: 'span',
            attributes: [{
              name: 'data-variable-target',
              value: field.target,
            }]
          }

          content = replaceElementByText(content, searchFor, field.sample)
        })

        this.$emit('updatePreview', content)
      }
    },

    props: {
      content: {
        type: String,
        default: '',
      },
      fields: {
        type: Array,
        default: () => ([]),
      }
    }
  }
</script>

<style>
  .editor__content {
    border: 1px solid #ccc !important;
    border-top: 0 !important;
    padding: 10px 10px 2px 10px;
  }

  .editor__content:hover {
    background-color: rgba(229, 235, 243, 0.4);
  }

  .menubar {
    border-style: solid;
    border-width: 1px 1px 1px 1px;
    border-color: #ccc;
    width: 100%;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
  }

  .menubar button {
    border-right: 1px dotted #bbb !important;
    padding: 3px 10px;
    min-width: 40px;
  }

  .menubar button:last-child {
    border-right-width: 0 !important;
  }

  .menubar .is-active {
    background-color: #888 !important;
  }

  .menubar .is-active > * {
    color: white !important;
  }

  span.variable {
    background-color: #eedfd4;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 2px;
    margin-right: 1px;
  }

  table {
    border-spacing: 0;
  }

  td, th {
    border: 1px solid #ddd;
    min-width: 20px;
  }
</style>
