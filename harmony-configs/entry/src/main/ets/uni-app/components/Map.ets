import { MapComponent, mapCommon, map } from '@kit.MapKit';
import { AsyncCallback } from '@kit.BasicServicesKit';

@Component
export struct Map {
  @Prop longitude: number;
  @Prop latitude: number;
  @Prop zoom: number;
  private mapOption?: mapCommon.MapOptions;
  private callback?: AsyncCallback<map.MapComponentController>;
  private mapController?: map.MapComponentController;

  aboutToAppear(): void {
    this.mapOption = {
      position: {
        target: {
          latitude: this.latitude,
          longitude: this.longitude
        },
        zoom: this.zoom,
      },
      mapType: mapCommon.MapType.STANDARD,
      myLocationControlsEnabled: true,
    };

    this.callback = async (err, mapController) => {
      if (!err) {
        this.mapController = mapController;
        this.mapController.on('mapLoad', () => {
          console.info('mapLoad');
        });
      } else {
        console.error('map init failed');
      }
    };
  }

  build() {
    MapComponent({ mapOptions: this.mapOption, mapCallback: this.callback });
  }
}
