<template lang="pug">
  control-wrapper(
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
    v-model:is-hovered="isHovered"
  )
    q-bar.q-pr-none(bordered)
      q-toolbar-title(v-text='controlWrapper.label')
      q-btn-group.q-mx-sm(flat)
        template(v-for="item in topToolbar" :key="item.name")
          q-separator(v-if="item.type === 'separator'" vertical)
          q-btn-group.q-mx-sm(v-else-if="item.type === 'group'" flat)
            q-btn(
              v-for="subItem in item.items" :key="subItem.name"
              :icon="subItem.icon"
              @click="subItem.command()"
              :class="{ 'text-primary': editor?.isActive(subItem.name) }"
              :disabled="subItem?.disabled ? subItem?.disabled() : false"
              dense
            )
          q-btn-group.q-mx-sm(v-else-if="item.type === 'button'" flat)
            q-btn(
              :icon="item.icon"
              @click="item.command()"
              :class="{ 'text-primary': editor?.isActive(item.name) }"
              dense
            )
    q-separator
    q-bar.q-pr-none(bordered)
      q-space
      q-btn-group.q-mx-sm(flat)
        //- background color
        q-btn-dropdown(
          :color="editor?.getAttributes('textStyle')?.backgroundColor ? 'primary' : ''"
          :label="editor?.getAttributes('textStyle')?.backgroundColor ? editor?.getAttributes('textStyle')?.backgroundColor : 'BG Color'"
          auto-close
          dense
          flat
        )
          template(#default)
            q-list
              q-item(
                v-for="color in ['white', 'black', 'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'gray']" :key="color"
                @click="editor?.chain().focus().setBackgroundColor(color).run()"
                clickable
                dense
              )
                q-item-section
                  q-item-label(:class="{ 'text-primary': editor?.isActive('textStyle', { backgroundColor: color }) }")
                    span(:style="{ 'background-color': color }") {{ color }}

      q-btn-group.q-mx-sm(flat)
        //- color
        q-btn-dropdown(
          :color="editor?.getAttributes('textStyle')?.color ? 'primary' : ''"
          :label="editor?.getAttributes('textStyle')?.color ? editor?.getAttributes('textStyle')?.color : 'Color'"
          auto-close
          dense
          flat
        )
          template(#default)
            q-list
              q-item(
                v-for="color in ['black', 'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'gray']" :key="color"
                @click="editor?.chain().focus().setColor(color).run()"
                clickable
                dense
              )
                q-item-section
                  q-item-label(:class="{ 'text-primary': editor?.isActive('textStyle', { color }) }")
                    span(:style="{ color: color }") {{ color }}
      q-btn-group.q-mx-sm(flat)
        //- font size
        q-btn-dropdown(
          :color="editor?.getAttributes('textStyle')?.fontSize ? 'primary' : ''"
          :label="editor?.getAttributes('textStyle')?.fontSize ? editor?.getAttributes('textStyle')?.fontSize : 'Size'"
          auto-close
          dense
          flat
        )
          template(#default)
            q-list
              q-item(
                v-for="size in ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px']" :key="size"
                @click="editor?.chain().focus().setFontSize(size).run()"
                clickable
                dense
              )
                q-item-section
                  q-item-label(:class="{ 'text-primary': editor?.isActive('textStyle', { fontSize: size }) }")
                    span(:style="{ 'font-size': size }") {{ size }}
      q-btn-group.q-mx-sm(flat)
        q-btn-dropdown(
          :color="editor?.getAttributes('textStyle')?.fontFamily ? 'primary' : ''"
          :label="editor?.getAttributes('textStyle')?.fontFamily ? editor?.getAttributes('textStyle')?.fontFamily : 'Font'"
          auto-close
          dense
          flat
        )
          template(#default)
            q-list
              q-item(
                v-for="font in ['BBH Sans Bogle', 'arial', 'comic-sans-ms', 'courier-new', 'georgia', 'helvetica', 'lucida-console', 'times-new-roman']" :key="font"
                @click="editor?.chain().focus().setFontFamily(font).run()"
                clickable
                dense
              )
                q-item-section
                  q-item-label(:class="{ 'text-primary': editor?.isActive('textStyle', { fontFamily: font }) }")
                    span(:style="{ 'font-family': font.replace(/-/g, ' ') }") {{ font.replace(/-/g, ' ') }}

      q-btn-group.q-mx-sm(flat)
        q-btn-dropdown(
          :color="editor?.getAttributes('heading')?.level ? 'primary' : ''"
          :icon="!editor?.getAttributes('heading')?.level ? 'mdi-format-paragraph' : 'mdi-format-header-' + editor?.getAttributes('heading')?.level"
          auto-close
          dense
          flat
        )
          template(#default)
            q-list
              q-item(
                @click="editor.chain().focus().setParagraph().run()"
                clickable
                dense
              )
                q-item-section
                  q-item-label(:class="{ 'text-primary': !editor?.getAttributes('heading')?.level }")
                    q-icon(name='mdi-format-paragraph')
              q-item(
                v-for="level in 6" :key="level"
                @click="editor.chain().focus().toggleHeading({ level }).run()"
                clickable
                dense
              )
                q-item-section
                  q-item-label(:class="{ 'text-primary': editor?.isActive('heading', { level }) }")
                    q-icon(:name="'mdi-format-header-' + level")
      q-separator(v-if="baseToolbar[0]?.type !== 'separator'" vertical)

      template(v-for="item in baseToolbar" :key="item.name")
        q-separator(v-if="item.type === 'separator'" vertical)
        q-btn-group.q-mx-sm(v-else-if="item.type === 'group'" flat)
          q-btn(
            v-for="subItem in item.items" :key="subItem.name"
            :icon="subItem.icon"
            @click="subItem.command()"
            :class="{ 'text-primary': editor?.isActive(subItem.name) }"
            :disabled="subItem?.disabled ? subItem?.disabled() : false"
            dense
          )
        q-btn-group.q-mx-sm(v-else-if="item.type === 'button'" flat)
          q-btn(
            :icon="item.icon"
            @click="item.command()"
            :class="{ 'text-primary': editor?.isActive(item.name) }"
            dense
          )
      q-separator(vertical)
      q-btn-group.q-mx-sm(flat)
        q-btn(
          icon='mdi-details'
          @click="details = !details"
          :class="{ 'rotate-180': details }"
          dense
        )

    q-separator(v-if='details && baseToolbar[baseToolbar.length - 1]?.type !== "separator"')

    q-bar.q-pr-none(v-if='details' bordered)
      q-btn-group.q-mx-sm(flat)
        q-btn(
          v-for="level in 6" :key="level" v-if='$q.screen.gt.md'
          :icon="'mdi-format-header-' + level"
          @click="editor.chain().focus().toggleHeading({ level }).run()"
          :class="{ 'text-primary': editor?.isActive('heading', { level }) }"
          dense
        )
      q-separator(vertical)
      q-btn-group.q-mx-sm(flat)
        q-btn(
          icon='mdi-format-quote-close'
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'text-primary': editor?.isActive('blockquote') }"
          dense
        )
        q-btn(
          icon='mdi-code-tags'
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'text-primary': editor?.isActive('codeBlock') }"
          dense
        )
      q-separator(vertical)

    q-field.q-custom(
      v-bind="quasarProps('q-field')"
      @focus="handleFocus"
      @blur="handleBlur"
      :id="control.key"
      :class="styles.control.input"
      :hint="control.description"
      :required="control.required"
      :hide-hint="persistentHint()"
      :error="control.errors !== ''"
      :error-message="control.errors"
      hide-bottom-space
      outlined
      autogrow
    )
      template(#control)
        editor-content.fit(
          :editor="editor"
        )
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isObjectControl,
  and,
  optionIs,
} from '@jsonforms/core'
import { rendererProps, useJsonFormsControl, RendererProps } from '@jsonforms/vue'
import { isEmpty } from 'radash'
import { ControlWrapper } from '../common'
import { determineClearValue, useQuasarControl } from '../utils'
import { defineComponent, ref } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Paragraph from '@tiptap/extension-paragraph'
import Image from '@tiptap/extension-image'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'
import { FontFamily, TextStyle, FontSize, Color, BackgroundColor } from '@tiptap/extension-text-style'

const controlRenderer = defineComponent({
  name: 'WysiwygControlRenderer',
  components: {
    ControlWrapper,
    EditorContent,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const clearValue = determineClearValue(undefined)
    const adaptTarget = (value: unknown) => (isEmpty(value) ? clearValue : value)
    const input = useQuasarControl(useJsonFormsControl(props), adaptTarget, 100)
    const details = ref(false)
    const editor = ref<Editor | null>(null)

    type ToolbarButton = {
      type: 'button'
      name: string
      icon: string
      command: () => void
      disabled?: () => boolean
    }
    type ToolbarGroup = {
      type: 'group'
      items: ToolbarButton[]
    }
    type ToolbarSeparator = { type: 'separator' }
    type ToolbarItem = ToolbarSeparator | ToolbarGroup | ToolbarButton

    const topToolbar: ToolbarItem[] = [
      {
        type: 'group',
        items: [
          {
            type: 'button',
            name: 'undo',
            icon: 'mdi-undo',
            command: () => editor.value?.chain().focus().undo().run(),
            disabled: () => (editor.value ? !editor.value.can().undo() : true),
          },
          {
            type: 'button',
            name: 'redo',
            icon: 'mdi-redo',
            command: () => editor.value?.chain().focus().redo().run(),
            disabled: () => (editor.value ? !editor.value.can().redo() : true),
          },
        ],
      },
    ]

    const baseToolbar: ToolbarItem[] = [
      { type: 'separator' },
      {
        type: 'group',
        items: [
          {
            type: 'button',
            name: 'bulletList',
            icon: 'mdi-format-list-bulleted',
            command: () => editor.value?.chain().focus().toggleBulletList().run(),
          },
          {
            type: 'button',
            name: 'orderedList',
            icon: 'mdi-format-list-numbered',
            command: () => editor.value?.chain().focus().toggleOrderedList().run(),
          },
        ],
      },
      { type: 'separator' },
      {
        type: 'group',
        items: [
          {
            type: 'button',
            name: 'clearFormatting',
            icon: 'mdi-format-clear',
            command: () => editor.value?.chain().focus().clearNodes().run(),
          },
          {
            type: 'button',
            name: 'bold',
            icon: 'mdi-format-align-left',
            command: () => editor.value?.chain().focus().setTextAlign('left').run(),
          },
          {
            type: 'button',
            name: 'center',
            icon: 'mdi-format-align-center',
            command: () => editor.value?.chain().focus().setTextAlign('center').run(),
          },
          {
            type: 'button',
            name: 'right',
            icon: 'mdi-format-align-right',
            command: () => editor.value?.chain().focus().setTextAlign('right').run(),
          },
        ],
      },
      { type: 'separator' },
      {
        type: 'group',
        items: [
          {
            type: 'button',
            name: 'bold',
            icon: 'mdi-format-bold',
            command: () => editor.value?.chain().focus().toggleBold().run(),
          },
          {
            type: 'button',
            name: 'italic',
            icon: 'mdi-format-italic',
            command: () => editor.value?.chain().focus().toggleItalic().run(),
          },
          {
            type: 'button',
            name: 'underline',
            icon: 'mdi-format-underline',
            command: () => editor.value?.chain().focus().toggleUnderline().run(),
          },
        ],
      },
    ]

    return {
      ...input,
      adaptTarget,
      details,
      editor,
      topToolbar,
      baseToolbar,
    }
  },
  mounted() {
    this.editor = new Editor({
      content: this.control.data || '',
      extensions: [
        StarterKit,
        Highlight,
        Typography,
        Image,
        Paragraph,
        Document,
        Text,
        TextStyle,
        FontFamily,
        FontSize,
        TextAlign,
        Color,
        BackgroundColor,
        Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      ],
      onUpdate: ({ editor }) => {
        this.onChange(editor.getJSON())
      },
    })
  },

  beforeUnmount() {
    this.editor?.destroy()
  },
})

export default controlRenderer

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, and(isObjectControl, optionIs('wysiwyg', true))),
}
</script>

<style lang="scss" scoped>
:deep(.q-custom) {
  .q-field__native,
  .q-field__control {
    padding: 0;
  }

  .q-field__control {
    border-radius: 0 0 0.25rem 0.25rem;
  }

  .tiptap.ProseMirror {
    height: 100%;
    padding: 5px 15px;
  }

  .ProseMirror-focused {
    outline: inherit;
  }

  .tiptap p {
    margin: 1em 0;
  }
}

:deep(.q-field--auto-height .q-field__control-container) {
  padding-top: 0 !important;
}
</style>
