@CustomDialog
struct Loading {
  @Prop title: string
  controller: CustomDialogController
  build() {
    Column() {
      LoadingProgress()
        .width('38vp')
        .height('38vp')
        .margin('8vp')
        .color(Color.White)
      if (this.title) {
        Text(this.title)
          .fontColor(Color.White)
          .fontSize('14vp')
      }
    }
    .alignItems(HorizontalAlign.Center)
    .justifyContent(FlexAlign.Center)
    .width('120vp')
    .height('120vp')
    .backgroundColor('#ff4c4c4c')
    .borderRadius('5vp')
  }
}

interface IShowLoadingOptions {
  title: string
  mask: boolean
}

const showLoadingControllers: CustomDialogController[] = []

function createShowLoadingController(options: IShowLoadingOptions) {
  const controller = new CustomDialogController({
    builder: Loading({
      title: options.title || '',
    }),
    alignment: DialogAlignment.Center,
    customStyle: true,
    isModal: options.mask == undefined ? false : options.mask,
    onWillDismiss: () => {
      hideLoading()
    }
  })
  return controller
}

export function showLoading(options: IShowLoadingOptions, page: Object) {
  const controller: CustomDialogController = createShowLoadingController.bind(page)(options)
  showLoadingControllers.push(controller)
  controller.open()
}

export function hideLoading() {
  showLoadingControllers.forEach((controller) => {
    controller.close()
  })
  showLoadingControllers.splice(0, showLoadingControllers.length)
}
