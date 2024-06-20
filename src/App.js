import React, { useEffect, useRef } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import LayerList from '@arcgis/core/widgets/LayerList';
import TileLayer from '@arcgis/core/layers/TileLayer';

function App() {
  const mapRef = useRef(null);

  useEffect(() => {
    const streetLayer = new TileLayer({
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
      title: "Street Layer"
    });

    const aerialLayer = new TileLayer({
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      title: "Aerial Layer",
      visible: false
    });

    const map = new Map({
      layers: [streetLayer, aerialLayer]
    });

    const view = new MapView({
      container: mapRef.current,
      map: map,
      center: [-100.33, 25.69],
      zoom: 3
    });

    const layerList = new LayerList({
      view: view,
      listItemCreatedFunction: function (event) {
        const item = event.item;
        if (item.layer.title === "Street Layer") {
          item.layer.visible = true;
        } else {
          item.layer.visible = false;
        }
      }
    });

    view.ui.add(layerList, "top-right");

    const dropdown = document.createElement("select");
    dropdown.onchange = (e) => {
      if (e.target.value === "street") {
        streetLayer.visible = true;
        aerialLayer.visible = false;
      } else {
        streetLayer.visible = false;
        aerialLayer.visible = true;
      }
    };

    const streetOption = document.createElement("option");
    streetOption.value = "street";
    streetOption.text = "Street Layer";
    streetOption.selected = true;
    dropdown.appendChild(streetOption);

    const aerialOption = document.createElement("option");
    aerialOption.value = "aerial";
    aerialOption.text = "Aerial Layer";
    dropdown.appendChild(aerialOption);

    view.ui.add(dropdown, "top-right");

    return () => {
      if (view) {
        view.container = null;
      }
    };
  }, []);

  return (
    <div className="App">
      <div ref={mapRef} style={{ width: '1000px', height: '1000px' }}></div>
    </div>
  );
}

export default App;
