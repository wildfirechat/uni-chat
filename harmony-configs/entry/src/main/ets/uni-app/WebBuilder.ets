interface JavaScriptProxy {
  object: object;
  name: string;
  methodList: Array<string>;
  controller: WebviewController;
}

interface pageStyle {
  backgroundColor: string
}

interface WebBuilderOptions extends WebOptions {
  javaScriptProxy: JavaScriptProxy
  safeAreaEdges: Array<SafeAreaEdge>
  backgroundColor?: string
  onPageBegin: () => void
  onPageEnd: () => void
  onPageVisible: () => void
  onInterceptRequest: () => WebResourceResponse
  onNativeEmbedLifecycleChange: (event: NativeEmbedDataInfo) => void
  onNativeEmbedGestureEvent: (event: NativeEmbedTouchInfo) => void
  onAreaChange: (oldValue: Area, newValue: Area) => void
}

@Builder
export function WebBuilder(options: WebBuilderOptions) {
  Web(options)
    .backgroundColor(options.backgroundColor || Color.Transparent)
    .javaScriptProxy(options.javaScriptProxy)
    .onConsole(event => {
      if (event) {
        console.log(event.message.getMessage())
      }
      return false
    })
    .onErrorReceive(event => {
      if (event) {
        console.error(event.error.getErrorInfo())
      }
    })
    .onPageBegin(options.onPageBegin)
    .onPageEnd(options.onPageEnd)
    .onPageVisible(options.onPageVisible)
    .onInterceptRequest(options.onInterceptRequest)
    .enableNativeEmbedMode(true)
    .onNativeEmbedLifecycleChange(options.onNativeEmbedLifecycleChange)
    .onNativeEmbedGestureEvent(options.onNativeEmbedGestureEvent)
    .fileAccess(true)
    .domStorageAccess(true)
    .overScrollMode(OverScrollMode.NEVER)
    .expandSafeArea([SafeAreaType.SYSTEM, SafeAreaType.KEYBOARD], options.safeAreaEdges)
    .metaViewport(true)
    .mediaPlayGestureAccess(false)
    .onAreaChange(options.onAreaChange)
}
