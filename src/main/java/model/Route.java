package model;

import com.google.maps.model.LatLng;

import java.util.List;

public class Route {
  String summary;
  List<LatLng> overviewPolyline;

  public Route(String summary, List<LatLng> overviewPolyline) {
    this.summary = summary;
    this.overviewPolyline = overviewPolyline;
  }
}