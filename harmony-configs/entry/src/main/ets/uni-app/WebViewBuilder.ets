import harmonyWebView from '@ohos.web.webview'
import { initChildrenViewController } from '../../resources/rawfile/uni-app/uni-app-harmony-framework-dev'
import { WebView } from './components/WebView'

@Component
export struct WebViewContainer {
  @Prop options: WebViewBuilderOptions

  build() {
    WebView({
      src: this.options.src,
      onMessage: this.options.onMessage,
      onTitleUpdate: this.options.onTitleUpdate,
      onPostMessageToService: this.options.onPostMessageToService,
      exposeWebViewController: this.options.exposeWebViewController,
    }).position({
      x: this.options.x,
      y: this.options.y,
    }).width(this.options.width).height(this.options.height)
  }

  aboutToAppear(): void {
    initChildrenViewController(this)
  }
}

interface WebViewBuilderOptions {
  id: string
  src: string
  onMessage: () => void
  onTitleUpdate: () => void
  onPostMessageToService: () => void
  exposeWebViewController: (controller: harmonyWebView.WebviewController) => void
  width: number
  height: number
  x: number
  y: number
}

@Builder
export function WebViewBuilder(options: WebViewBuilderOptions) {
  WebViewContainer({ options: options })
}
