import harmonyWebView from '@ohos.web.webview'
import picker from '@ohos.file.picker';
import { BusinessError } from '@ohos.base';
import { abilityAccessCtrl, common } from '@kit.AbilityKit';

interface Detail {}

interface Event {
  detail: Detail
}

interface TitleUpdateEventDetail {
  title?: string
}

interface TitleUpdateEvent extends Event {
  detail: TitleUpdateEventDetail
}

@Component
export struct WebView {
  @Prop @Watch('setSrc') src: string
  onMessage?: (event: Event) => void = undefined
  onTitleUpdate?: (event: TitleUpdateEvent) => void = undefined
  onPostMessageToService?: (event: Event) => void = undefined
  exposeWebViewController?: (controller: harmonyWebView.WebviewController) => void = undefined
  controller = new harmonyWebView.WebviewController()

  aboutToAppear(): void {
    this.exposeWebViewController?.(this.controller)
  }

  build() {
    Web({
      src: this.src,
      controller: this.controller
    })
      .overScrollMode(OverScrollMode.NEVER)
      .geolocationAccess(true)
      .domStorageAccess(true)
      .imageAccess(true)
      .fileAccess(true)
      .onTitleReceive(event => {
        this.onTitleUpdate?.({
          detail: {
            title: event?.title
          }
        })
      })
      .onConsole(event => {
        if (event) {
          console.log('getMessage: ' + JSON.stringify(event.message.getMessage()))
        }
        return false
      })
      .onErrorReceive(event => {
        if (event) {
          console.error(event.error.getErrorInfo())
        }
      })
      .javaScriptProxy({
        object: {
          postMessage: (data: string) => {
            if (this.onMessage) {
              this.onMessage({ detail: JSON.parse(data) })
            }
          },
          postMessageToService: (data: string) => {
            if (this.onPostMessageToService) {
              this.onPostMessageToService({ detail: JSON.parse(data) })
            }
          }
        },
        name: '__uniapp_x_',
        methodList: ['postMessage', 'postMessageToService'],
        controller: this.controller
      })
      .onGeolocationShow((event) => {

        let context = getContext(this) as common.UIAbilityContext;
        let atManager = abilityAccessCtrl.createAtManager();
        atManager.requestPermissionsFromUser(context, ["ohos.permission.APPROXIMATELY_LOCATION"]).then((data) => {
          console.info('data authResults:' + data.authResults);
        }).catch((error: BusinessError) => {
          console.error(`Failed to request permissions from user. Code is ${error.code}, message is ${error.message}`);
        })

        AlertDialog.show({
          title: '位置权限请求',
          message: '是否允许获取位置信息',
          primaryButton: {
            value: 'cancel',
            action: () => {
              if (event) {
                event.geolocation.invoke(event.origin, false, false);
              }
            }
          },
          secondaryButton: {
            value: 'ok',
            action: () => {
              if (event) {
                event.geolocation.invoke(event.origin, true, true);
              }
            }
          },
          cancel: () => {
            if (event) {
              event.geolocation.invoke(event.origin, false, false);
            }
          }
        })
      })
      .onShowFileSelector((event) => {
        // TODO 真机运行没有问题，模拟器运行后，选择图片后H5端无法获取图片信息
        const selectOptions = new picker.PhotoSelectOptions();
        const mode = event?.fileSelector.getMode();
        const acceptType = event?.fileSelector.getAcceptType();
        if (mode === 0) {
          selectOptions.maxSelectNumber = 1;
        }
        if (acceptType) {
          let type = "";
          const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.svg', '.webp'];
          const containsImage = imageExtensions.some((ext: string): boolean => acceptType.includes(ext));
          const videoExtensions =
            ['.mp4', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.ogg', '.webm', 'mpg', 'mpeg', '.3gp', 'rm', 'rmvb',
              'm4v', 'wma', 'mts'];
          const containsVideo = videoExtensions.some((ext: string): boolean => acceptType.includes(ext));
          if (containsImage && containsVideo) {
            type = "IMAGE_VIDEO_TYPE";
          } else if (containsImage) {
            type = "IMAGE_TYPE";
          } else if (containsVideo) {
            type = "VIDEO_TYPE";
          }
          if (type) {
            selectOptions.MIMEType = picker.PhotoViewMIMETypes[type]
          }
        }
        let filePaths: Array<string> | null = null;
        const viewPicker = new picker.PhotoViewPicker();
        viewPicker.select(selectOptions).then((selectResult) => {
          filePaths = selectResult.photoUris;
          if (event) {
            event.result.handleFileList(filePaths);
          }
        }).catch((err: BusinessError) => {
          console.error(`Invoke viewPicker.select failed, code is ${err.code}, message is ${err.message}`);
        })
        return true
      })
  }

  setSrc() {
    this.controller.loadUrl(this.src)
  }
}
