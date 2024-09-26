import {
  WebNodeController,
  callPageLifeCycle,
} from '../../resources/rawfile/uni-app/uni-app-harmony-framework-dev';
import {
  TabBar,
  TabBarState,
  OnTabItemClickOptions,
  createTabBarState,
  createTabBarItem
} from '../uni-app/components/TabBar';
import { NavBar, ITitleNView } from '../uni-app/components/NavBar';
import { NodeController } from '@kit.ArkUI';
import { SafeAreaOffset } from '../uni-app/components/SafeAreaOffset';

@Observed
class PullToRefresh {
  support?: boolean
  constructor(pullToRefresh?: PullToRefresh) {
    this.support = pullToRefresh?.support
  }
}

@Observed
class ObservedPageStyle {
  titleNView?: ITitleNView
  pullToRefresh?: PullToRefresh
  background?: string
  backgroundTextStyle?: 'light' | 'dark'
  marginTop?: number
  paddingBottom?: number

  constructor(style: ObservedPageStyle) {
    this.titleNView = style.titleNView
    this.pullToRefresh = new PullToRefresh(style.pullToRefresh)
    this.background = style.background
    this.backgroundTextStyle = style.backgroundTextStyle
    this.marginTop = style.marginTop
    this.paddingBottom = style.paddingBottom
  }
}

@Observed
class ObservedChildren extends Array<NodeController> {
}

@Observed
class RefreshState {
  refreshing?: boolean
  onRefreshing?: () => void
  onRefreshStateChange?: (state?: RefreshStatus) => void
  constructor(state?: RefreshState) {
    this.refreshing = state?.refreshing
    this.onRefreshing = state?.onRefreshing
    this.onRefreshStateChange = state?.onRefreshStateChange
  }
}

@Observed
class SubPageState {
  id: string
  style: ObservedPageStyle
  embedChildren: ObservedChildren
  stackChildren: ObservedChildren
  refreshState: RefreshState

  constructor(id: string, style: ObservedPageStyle, embedChildren: NodeController[], stackChildren: NodeController[],
    refreshState?: RefreshState) {
    this.id = id
    this.style = new ObservedPageStyle(style)
    this.embedChildren = new ObservedChildren(...embedChildren)
    this.stackChildren = new ObservedChildren(...stackChildren)
    this.refreshState = new RefreshState(refreshState)
  }
}

export function createSubPageState(options: SubPageState) {
  return new SubPageState(options.id, options.style, options.embedChildren, options.stackChildren, options.refreshState)
}

export {
  createTabBarState, createTabBarItem
}

interface NavBarState extends ITitleNView {
  onBackClick?: (options: OnTabItemClickOptions) => void
}

@Component
struct PageChildren {
  @ObjectLink children: ObservedChildren
  build() {
    Stack({ alignContent: Alignment.TopStart }) {
      ForEach(this.children, (child: NodeController) => {
        NodeContainer(child)
      },(_: object, index: number) => {
        return '' + index
      })
    }
  }
}

abstract class IWebNodeController extends NodeController {
  abstract update: (options: Object) => void
}

interface IWebNodeStyle {
  backgroundColor: string
}
@Component
struct PageContainer {
  @ObjectLink subPage: SubPageState
  @Require @Prop @Watch('pageStyleChange') style: ObservedPageStyle
  webNode: IWebNodeController | null = null

  pageStyleChange(style: ObservedPageStyle) {
    this.updateWebNodeBackground({
      backgroundColor: style.background
    } as IWebNodeStyle)
  }

  updateWebNodeBackground(style: IWebNodeStyle) {
    if (this.webNode) {
      this.webNode.update({
        backgroundColor: style.backgroundColor || Color.Transparent
      } as IWebNodeStyle)
    }
  }

  aboutToAppear(): void {
    this.webNode = new WebNodeController(this.subPage.id) as IWebNodeController
    this.updateWebNodeBackground({
      backgroundColor: this.style.background
    } as IWebNodeStyle)
  }

  build() {
    Stack({ alignContent: Alignment.TopStart }) {
      Stack({ alignContent: Alignment.TopStart }) {
        PageChildren({ children: this.subPage.embedChildren })
        NodeContainer(this.webNode)
          .width('100%')
          .height('100%')
          .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
        PageChildren({ children: this.subPage.stackChildren })
      }
      .width('100%')
      .height('100%')
      .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
      .margin({
        top: this.style.marginTop
      })
    }
    .clip(true)
    .width('100%')
    .height('100%')
    .padding({
      bottom: this.style.paddingBottom
    })
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }
}

@Component
struct SubPage {
  @ObjectLink subPage: SubPageState
  @Require @Prop style: ObservedPageStyle
  @ObjectLink refreshState: RefreshState
  @Prop safeArea: SafeArea | undefined

  @Builder
  customRefreshComponent() {
    Stack() {
      Row() {
        LoadingProgress().height(32)
          .color(this.style.backgroundTextStyle === 'light' ? Color.White : '#5f5f5f')
      }
      .alignItems(VerticalAlign.Center)
    }.width("100%").align(Alignment.Center)
  }

  build() {
    Flex({
      direction: FlexDirection.Column,
    }) {
      if (this.style.titleNView) {
        NavBar({
          titleNView: this.style.titleNView,
          onBackClick: () => {
            callPageLifeCycle('onBackPress', this)
          }
        })
      }

      Stack() {
        if (this.style.pullToRefresh?.support) {
          Refresh({
            refreshing: $$this.refreshState.refreshing,
            builder: this.customRefreshComponent()
          }) {
            PageContainer({ subPage: this.subPage, style: this.style })
          }
          .backgroundColor(this.style.background)
          .onStateChange(status => {
            this.refreshState.onRefreshStateChange?.(status)
          })
          .onRefreshing(() => {
            this.refreshState.refreshing = true
            this.refreshState.onRefreshing?.()
          })
        } else {
          PageContainer({ subPage: this.subPage, style: this.style })
        }
      }
      .clip(true)
      .width('100%')
      .flexGrow(1)
      .flexBasis(1)
      .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])

    }.width('100%')
    .height('100%')
    .backgroundColor(this.style.background)
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }
}

@Observed
class ObservedPages extends Array<SubPageState> {
}

interface SafeAreaBottom {
  offset?: string
}

interface SafeArea {
  background?: string
  bottom?: SafeAreaBottom
}

@Entry
@Component
struct Page {
  @State pages: SubPageState[] = new ObservedPages()
  @State safeArea: SafeArea | undefined = undefined
  @State tabBar: TabBarState | undefined = undefined
  @State navBar: NavBarState | undefined = undefined

  build() {
    Flex({
      direction: FlexDirection.Column,
    }) {
      Stack() {
        ForEach(this.pages, (subPage: SubPageState, index: number) => {
            SubPage({
              subPage: subPage,
              style: subPage.style,
              refreshState: subPage.refreshState,
              safeArea: this.safeArea
            })
        })
      }
      .width('100%')
      .flexGrow(1)
      .flexBasis(1)
      .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])

      if (this.tabBar && this.tabBar.list && this.tabBar.list.length > 0) {
        TabBar({
          style: this.tabBar,
          selectedIndex: this.tabBar.selectedIndex,
          items: this.tabBar.list,
          onTabItemClick: (options: OnTabItemClickOptions) => {
            this.tabBar?.onClick?.(options)
          }
        })
        .visibility(this.tabBar.visible === false ? Visibility.None : Visibility.Visible)
      } else if (this.safeArea && this.safeArea?.bottom?.offset === 'auto') {
        SafeAreaOffset({ type: 'bottom' })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(this.safeArea?.background)
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }

  aboutToAppear() {
    callPageLifeCycle('aboutToAppear', this)
  }

  aboutToDisappear() {
    callPageLifeCycle('aboutToDisappear', this)
  }

  onPageShow(): void {
    callPageLifeCycle('onPageShow', this)
  }

  onPageHide(): void {
    callPageLifeCycle('onPageHide', this)
  }

  onBackPress(): boolean | void {
    return callPageLifeCycle('onBackPress', this)
  }

  pageTransition() {
    if (callPageLifeCycle('pageTransition', this).enter.push === 'none') {
      PageTransitionEnter({ type: RouteType.Push, duration: 0 })
    }
    if (callPageLifeCycle('pageTransition', this).enter.pop === 'none') {
      PageTransitionEnter({ type: RouteType.Pop, duration: 0 })
    }
    if (callPageLifeCycle('pageTransition', this).exit.push === 'none') {
      PageTransitionExit({ type: RouteType.Push, duration: 0 })
    }
    if (callPageLifeCycle('pageTransition', this).exit.pop === 'none') {
      PageTransitionExit({ type: RouteType.Pop, duration: 0 })
    }
  }
}
