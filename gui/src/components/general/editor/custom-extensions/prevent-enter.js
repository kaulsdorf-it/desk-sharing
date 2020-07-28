import { Extension } from 'tiptap'

export class PreventEnter extends Extension {
  keys() {
    return {
      Enter() {
        // return true prevents default behaviour
        return true
      },
    }
  }
}
