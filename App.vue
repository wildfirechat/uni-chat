<script>
import wfc from 'wfc/client/wfc.js'
export default {
  onLaunch: function () {
    console.log("App Launch0000");
	wfc.init();

  },
  onShow: function () {
    console.log("App Show0000");
  },
  onHide: function () {
    console.log("App Hide111");
  },
};
</script>

<style>
/*每个页面公共css */
@import './global.css';
@import './wfc.css';
</style>
