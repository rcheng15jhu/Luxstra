package model;

import com.google.maps.model.LatLng;

import java.util.List;

public class RouteDirections {
  String summary;
  List<LatLng> overviewPolyline;
  List<String> HTMLDirections;

  public RouteDirections(String summary, List<LatLng> overviewPolyline, List<String> HTMLDirections) {
    this.summary = summary;
    this.overviewPolyline = overviewPolyline;
    this.HTMLDirections = HTMLDirections;
  }
}
