import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import window from '@ohos.window';
import {
  callAppLifeCycle,
  setOSRuntime,
  setManifest,
  initUniApi
} from '../../resources/rawfile/uni-app/uni-app-harmony-framework-dev';
import { initUniExtApi } from '@dcloudio/uni-app-harmony'
import manifest from '../../resources/rawfile/apps/HBuilder/www/manifest.json'
import { WebBuilder } from '../uni-app/WebBuilder'
import { WebViewBuilder } from '../uni-app/WebViewBuilder'
import { createSubPageState, createTabBarState, createTabBarItem } from '../pages/Page'
import { MapBuilder } from '../uni-app/MapBuilder'
import { PickerBuilder } from '../uni-app/PickerBuilder'
import { initUniModules } from '../uni_modules/index.generated'
import { previewImage, closePreviewImage } from '../uni-app/components/ImagePreviewer'
import { showLoading, hideLoading } from '../uni-app/components/ShowLoading'
import '../../resources/rawfile/apps/HBuilder/www/app-config-service';
import protoProxy from "libmarswrapper.so"

setManifest(manifest)
setOSRuntime({
  getContext,
  WebBuilder,
  createSubPageState,
  createTabBarState,
  createTabBarItem,
  WebViewBuilder,
  MapBuilder,
  PickerBuilder,
  previewImage,
  closePreviewImage,
  showLoading,
  hideLoading
})

initUniModules(initUniApi(initUniExtApi('HBuilder')))

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
      // TODO
      // 插件初始化的时机太早了，拿不到 context 故放在这儿进行设置 dbpath
      // 后续可以单独开一个 api，能拿到 context 的时候，在设置 dbpath
      protoProxy.setDBPath(this.context.filesDir)
    callAppLifeCycle('onCreate', this)
  }

  onDestroy(): void {
    callAppLifeCycle('onDestroy', this)
  }

  onWindowStageCreate(windowStage: window.WindowStage) {
    import('./init')
    callAppLifeCycle('onWindowStageCreate', this, windowStage)
  }

  onWindowStageDestroy(): void {
    callAppLifeCycle('onWindowStageDestroy', this)
  }

  onForeground(): void {
    callAppLifeCycle('onForeground', this)
  }

  onBackground(): void {
    callAppLifeCycle('onBackground', this)
  }
}
