package model;

import com.google.maps.model.LatLng;

import java.util.List;

public class RouteDirections {
  List<LatLng> overviewPolyline;
  List<String> HTMLDirections;

  public RouteDirections(List<LatLng> overviewPolyline, List<String> HTMLDirections) {
    this.overviewPolyline = overviewPolyline;
    this.HTMLDirections = HTMLDirections;
  }
}
