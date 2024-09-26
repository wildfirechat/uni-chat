import { initChildrenViewController } from '../../resources/rawfile/uni-app/uni-app-harmony-framework-dev'
import { Picker } from './components/Picker'

@Component
export struct PickerContainer {
  @Prop options: PickerBuilderOptions

  build() {
    Picker({
      range: this.options.range,
      value: this.options.value,
      rangeKey: this.options.rangeKey,
      start: this.options.start,
      end: this.options.end,
      fields: this.options.fields,
      disabled: this.options.disabled,
      mode: this.options.mode,
      click: this.options.click,
      onCancel: this.options.on?.cancel,
      onChange: this.options.on?.change,
      onColumnchange: this.options.on?.columnchange
    }).position({
      x: this.options.x,
      y: this.options.y,
    }).width(this.options.width).height(this.options.height)
  }

  aboutToAppear(): void {
    initChildrenViewController(this)
  }
}

interface On {
  cancel?: () => void
  change?: () => void
  columnchange?: () => void
}

interface PickerBuilderOptions {
  id: string
  width: number
  height: number
  x: number
  y: number
  range: string[] | string[][]
  value: string | number | number[]
  rangeKey?: string
  start?: string
  end?: string
  fields?: 'year' | 'month' | 'day',
  disabled?: boolean
  mode?: 'selector' | 'multiSelector' | 'time' | 'date'
  click: number
  on?: On
}

@Builder
export function PickerBuilder(options: PickerBuilderOptions) {
  PickerContainer({ options: options })
}
