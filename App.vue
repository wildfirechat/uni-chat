<script>
import wfc from 'wfc/client/wfc.js'
export default {
  onLaunch: function () {
    console.log("App Launch");
	wfc.init();

  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style>
/*每个页面公共css */
@import './global.css';
@import './wfc.css';
@import './static/customicons.css';

</style>
