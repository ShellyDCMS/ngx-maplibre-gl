import { Component, OnDestroy, OnInit } from '@angular/core';
import { LngLatLike } from 'maplibre-gl';

@Component({
  selector: 'showcase-demo',
  template: `
    <mgl-map
      [style]="
        'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL'
      "
      [zoom]="zoom"
      [center]="center"
      [centerWithPanTo]="true"
      [pitch]="pitch"
      movingMethod="jumpTo"
      [preserveDrawingBuffer]="true"
    >
      <mgl-geojson-source *ngIf="data" id="trace" [data]="data">
      </mgl-geojson-source>
      <mgl-layer
        *ngIf="data"
        id="trace"
        type="line"
        source="trace"
        [paint]="{
          'line-color': 'yellow',
          'line-opacity': 0.75,
          'line-width': 5
        }"
      >
      </mgl-layer>
    </mgl-map>
  `,
  styleUrls: ['./examples.css'],
})
export class LiveUpdateFeatureComponent implements OnInit, OnDestroy {
  data: GeoJSON.FeatureCollection<GeoJSON.LineString>;
  center: LngLatLike;
  zoom = [0];
  pitch: number;

  private timer: number;

  constructor() {}

  async ngOnInit() {
    const data: GeoJSON.FeatureCollection<GeoJSON.LineString> = (await import(
      './hike.geo.json'
    )) as any;
    const coordinates = data.features[0].geometry!.coordinates;
    data.features[0].geometry!.coordinates = [coordinates[0]];
    this.data = data;
    this.center = <[number, number]>coordinates[0];
    this.zoom = [14];
    this.pitch = 30;
    let i = 0;
    this.timer = window.setInterval(() => {
      if (i < coordinates.length) {
        this.center = <[number, number]>coordinates[i];
        data.features[0].geometry!.coordinates.push(coordinates[i]);
        this.data = { ...this.data };
        i++;
      } else {
        window.clearInterval(this.timer);
      }
    }, 10);
  }

  ngOnDestroy() {
    window.clearInterval(this.timer);
  }
}
