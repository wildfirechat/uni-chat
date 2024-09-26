import {
  isLayoutFullScreen,
  getSafeAreaInsets,
  onSafeAreaInsetsChange,
  offSafeAreaInsetsChange
} from '../../../resources/rawfile/uni-app/uni-app-harmony-framework-dev';

interface SafeAreaInsets {
  top?: number
  bottom?: number
}

@Component
export struct SafeAreaOffset {
  @Prop type: string
  @State h: number = 0
  onSafeAreaInsetsChange = (safeAreaInsets: SafeAreaInsets) => {
    if (this.type === 'top' && typeof safeAreaInsets.top === 'number') {
      this.h = safeAreaInsets.top
    } else if (this.type === 'bottom' && typeof safeAreaInsets.bottom === 'number') {
      this.h = safeAreaInsets.bottom
    }
  }

  build() {
    Stack().height(this.h + 'px').width('100%')
  }

  aboutToAppear(): void {
    if (!isLayoutFullScreen()) {
      return
    }
    const safeAreaInsets: SafeAreaInsets = getSafeAreaInsets(true)
    this.onSafeAreaInsetsChange(safeAreaInsets)
    onSafeAreaInsetsChange(this.onSafeAreaInsetsChange, true)
  }

  aboutToDisappear(): void {
    offSafeAreaInsetsChange(this.onSafeAreaInsetsChange)
  }
}
