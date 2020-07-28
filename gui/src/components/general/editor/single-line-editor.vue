<template>
  <div class="editor">
    <v-form @submit.prevent="() => {}">
      <editor-content
        :editor="editor"
        @keydown="test"
        class="editor__content"
      />

      <editor-menu-bar :editor="editor" class="menubar" style="width: 70px;" v-slot="{ commands, isActive }">
        <v-menu offset-y open-on-hover>
          <template v-slot:activator="{ on }">
            <button v-on="on">
              <v-icon>{{ menuItem.icon }}</v-icon>
              <v-icon>mdi-chevron-down</v-icon>
            </button>
          </template>

          <v-list dense>
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
      </editor-menu-bar>
    </v-form>
  </div>
</template>

<script>
  import { Editor, EditorContent, EditorMenuBar } from 'tiptap/dist/tiptap.esm'

  import Variables from './custom-extensions/variables'
  import { PreventEnter } from './custom-extensions/prevent-enter'

  export default {
    beforeDestroy() {
      this.editor.destroy()
    },

    components: {
      EditorContent,
      EditorMenuBar,
    },

    computed: {
      content: {
        get() {
          return this.value
        },
        set(data) {
          this.$emit('set', data)
        }
      }
    },

    data() {
      return {
        editor: new Editor({
          extensions: [
            new Variables(),
            new PreventEnter(),
          ],
          onUpdate: ({ getHTML }) => {
            const content = getHTML()
            const response = content.substr(3, content.length - 7)
            this.$emit('set', response)
          },
          content: '<p>' + this.value + '</p>',
        }),
        menuItem: {
          icon: 'mdi-textbox',
          items: this.fields.map(field => ({
            command: 'variable',
            label: field.label,
            param: field,
            checkFor: 'variable',
            icon: field.icon,
          }))
        },
      }
    },

    methods: {
      test(data) {
        console.log(data)
      },
    },

    props: {
      value: {
        type: String,
        default: 'wertzuiop',
      },
      fields: {
        type: Array,
        default: () => ([]),
      }
    }
  }
</script>

<style scoped>
  .editor {
    height: 55px;
  }

  .editor__content {
    border: 1px solid #888 !important;
    border-radius: 4px;
    float: left;
    height: 44px;
    padding: 10px;
    width: calc(100% - 80px);
  }

  .editor__content:hover {
    background-color: rgba(229, 235, 243, 0.4);
  }

  button {
    float: left;
    border: 1px solid #888 !important;
    border-radius: 4px;
    height: 44px;
    margin-left: 10px;
    padding: 3px 10px;
    width: 70px;
  }

  span.variable {
    background-color: #eedfd4;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 2px;
    margin-right: 1px;
  }
</style>
