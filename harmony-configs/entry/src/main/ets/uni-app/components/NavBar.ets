import { SafeAreaOffset } from './SafeAreaOffset'

export interface ITitleNView {
  titleText?: string;
  backgroundColor?: string;
  titleColor?: string;
  autoBackButton?: boolean;
  loading?: boolean
}

@Component
export struct NavBar {
  onBackClick?: () => void;
  @Prop titleNView: ITitleNView;

  build() {
    Column() {
      SafeAreaOffset({ type: 'top' })
      Flex({ direction: FlexDirection.Row, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Start }) {
        if (this.titleNView.autoBackButton) {
          Stack() {
            Text(' ')
              .fontSize(24)
              .fontColor(this.titleNView.titleColor)
              .margin({ left: 16, right: 16 })
              .width(15)
              .height(15)
              .border({
                width: {
                  left: 2,
                  bottom: 2,
                  top: 0,
                  right: 0
                },
                color: this.titleNView.titleColor,
                style: BorderStyle.Solid,
                radius: {
                  bottomLeft: 2
                }
              })
              .rotate({
                angle: 45
              })
          }
          .width(40)
          .height(40)
          .onClick(() => {
            this.onBackClick?.();
          });
        }
        if (this.titleNView.titleText) {
          Text(this.titleNView.titleText)
            .fontSize(20)
            .fontColor(this.titleNView.titleColor)
            .maxLines(1)
            .textOverflow({
              overflow: TextOverflow.Ellipsis
            })
            .margin({ left: this.titleNView.autoBackButton ? 0 : 16 });
        }
        if (this.titleNView.loading) {
          LoadingProgress()
            .width(32)
            .margin(4)
            .color(this.titleNView.titleColor)
        }
      }.height(56)
    }
    .backgroundColor(this.titleNView.backgroundColor).expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP])
  }
}
