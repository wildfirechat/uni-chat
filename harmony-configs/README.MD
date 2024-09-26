## 项目说明

1. `uni-chat` 项目，运行到鸿蒙，等待提示`Cannot find module 'marswrapper' or its corresponding type declarations`，并提示打包失败
2. 拷贝`app-harmony@x.y.x/entry/src/main/resources/rawfile`目录 到`entry/src/main/resources` 目录下
3. 用 DevEco Studio 打开 `harmony-config`
4. 运行


## 常见问题
1. 运行到鸿蒙时，报错：`ENOTSUP: operation not supported on socket, copyfile '/Users/xxx/uni-chat/harmony-configs/entry/oh_modules/marswrapper'`

    解决： 删除本目录下的`marswrapper/oh_modules`、`oh_modules` 和 `marswrapper/oh_modules`
