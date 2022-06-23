<script>
import store from "./store";
import wfc from "./wfc/client/wfc";

export default {
  onLaunch: function () {
    console.log("App Launch");
      plus.push.getClientInfoAsync((info) => {
          let cid = info["clientid"];
          console.log('xxx cid', cid)
          if (cid){
              wfc.setDeviceToken(cid);
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

</style>
