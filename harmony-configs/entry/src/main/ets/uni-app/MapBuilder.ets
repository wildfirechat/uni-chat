import { initChildrenViewController } from '../../resources/rawfile/uni-app/uni-app-harmony-framework-dev'
import { Map } from './components/Map'

@Component
export struct MapContainer {
  @Prop options: MapBuilderOptions

  build() {
    Map(this.options).position({
      x: this.options.x,
      y: this.options.y,
    }).width(this.options.width).height(this.options.height)
  }

  aboutToAppear(): void {
    initChildrenViewController(this)
  }
}

interface MapBuilderOptions {
  id: string
  longitude: number
  latitude: number
  zoom: number
  width: number
  height: number
  x: number
  y: number
}

@Builder
export function MapBuilder(options: MapBuilderOptions) {
  MapContainer({ options })
}
