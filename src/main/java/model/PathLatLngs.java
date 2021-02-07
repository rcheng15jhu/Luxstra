package model;

import com.google.maps.model.LatLng;

import java.util.List;

public class PathLatLngs {
  List<List<List<List<LatLng>>>> coords;

  public PathLatLngs(List<List<List<List<LatLng>>>> coords) {
    this.coords = coords;
  }
}
