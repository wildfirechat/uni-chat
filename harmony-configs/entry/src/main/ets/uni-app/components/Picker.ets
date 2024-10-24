interface Detail {
  column?: number
  value?: string | number | number[]
}

interface CustomEvent {
  detail: Detail
}

@Component
export struct Picker {
  @Prop mode?: 'selector' | 'multiSelector' | 'time' | 'date' = 'selector'
  @Prop range?: string[] | string[][] | object[] | object[][]
  @Prop value?: string | number | number[]
  @Prop rangeKey?: string = ''
  @Prop start?: string = ''
  @Prop end?: string = ''
  @Prop fields?: 'year' | 'month' | 'day' = 'day'
  @Prop disabled?: boolean = false
  @State lastValue: number[] = []
  onCancel?: (detail?: CustomEvent) => void = undefined
  onChange?: (detail?: CustomEvent) => void = undefined
  onColumnchange?: (detail?: CustomEvent) => void = undefined
  @Prop @Watch('show') click: number

  build() {
    Stack().onClick(() => {
      this.show()
    })
  }

  getPickerShowRange(): string[] | string[][] {
    if (this.mode === 'multiSelector') {
      return (this.range as (string | object)[][]).map(column => {
        return column.map(item => {
          if (this.rangeKey) {
            return (item as object)[this.rangeKey] as string
          }
          return item + '' as string
        })
      })
    } else {
      return (this.range as (string | object)[]).map(item => {
        if (this.rangeKey) {
          return (item as object)[this.rangeKey] as string
        }
        return item + '' as string
      })
    }
  }

  getPickerShowValue(realRange: string[] | string[][]): string | string[] | undefined {
    if (!this.value) {
      return
    }
    switch (this.mode) {
      case 'multiSelector':
        return (realRange as string[][]).map((column, index) => {
          return column[(this.value as number[])[index]]
        })
      case 'selector':
      default:
        return (realRange as string[])[this.value as number]
    }
  }

  show() {
    if (this.disabled) {
      return
    }
    let changeOrCancel = false
    if (this.mode === 'date') {
      DatePickerDialog.show({
        showTime: false,
        start: new Date(this.start),
        end: new Date(this.end),
        onAccept: (e: DatePickerResult) => {
          changeOrCancel = true
          this.onChange?.({
            detail: {
              value: e.year!.toString().padStart(2, '0') + '-' + (e.month! + 1).toString().padStart(2, '0') + '-' +
              e.day!.toString().padStart(2, '0')
            }
          })
        },
        onCancel: () => {
          changeOrCancel = true
          this.onCancel?.({
            detail: {}
          })
        },
        onDidDisappear: () => {
          if (!changeOrCancel) {
            this.onCancel?.({
              detail: {}
            })
          }
        }
      })
    } else if (this.mode === 'time') {
      TimePickerDialog.show({
        useMilitaryTime: true,
        format: TimePickerFormat.HOUR_MINUTE,
        onAccept: (e: TimePickerResult) => {
          changeOrCancel = true
          this.onChange?.({
            detail: {
              value: e.hour.toString().padStart(2, '0') + ':' + e.minute.toString().padStart(2, '0')
            }
          })
        },
        onCancel: () => {
          changeOrCancel = true
          this.onCancel?.({
            detail: {}
          })
        },
        onDidDisappear: () => {
          if (!changeOrCancel) {
            this.onCancel?.({
              detail: {}
            })
          }
        }
      })
    } else {
      if (this.mode === 'multiSelector') {
        this.lastValue = (this.value || []) as number[]
      }
      const realRange = this.getPickerShowRange()
      const realValue = this.getPickerShowValue(realRange)
      TextPickerDialog.show({
        range: realRange,
        value: realValue,
        onAccept: (e: TextPickerResult) => {
          changeOrCancel = true
          this.onChange?.({
            detail: {
              value: e.index
            }
          })
        },
        onChange: (e: TextPickerResult) => {
          if (this.mode !== 'multiSelector') {
            return
          }
          const currentValue = e.index as number[]
          let changedColumn = 0
          let changedValue: number = 0
          for (let i = 0; i < currentValue.length; i++) {
            if (this.lastValue[i] !== currentValue[i]) {
              changedColumn = i
              changedValue = currentValue[i]
            }
          }
          this.onColumnchange?.({
            detail: {
              column: changedColumn,
              value: changedValue
            }
          })
          this.lastValue = currentValue
        },
        onCancel: () => {
          changeOrCancel = true
          this.onCancel?.({
            detail: {}
          })
        },
        onDidDisappear: () => {
          if (!changeOrCancel) {
            this.onCancel?.({
              detail: {}
            })
          }
        }
      })
    }
  }
}
