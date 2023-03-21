<script>
import store from "./store";
import wfc from "./wfc/client/wfc";

export default {
  onLaunch: function () {
    console.log("App Launch");
      plus.push.getClientInfoAsync((info) => {
          let cid = info["clientid"];
          if (cid){
              console.log('push clientId', cid);
              wfc.setDeviceToken(7, cid);
          }
      });
  },
  onShow: function () {
    console.log("App Show");
      store.state.misc.isAppHidden = false;
  },
  onHide: function () {
    console.log("App Hide");
    store.state.misc.isAppHidden = true;
  },
};
</script>

<style>
/*每个页面公共css */
@import './global.css';
@import './wfc.css';
@import './static/customicons.css';
@import './assets/fonts/icomoon/style.css';

</style>
