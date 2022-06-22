<script>
import store from "./store";

export default {
  onLaunch: function () {
    console.log("App Launch");

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
