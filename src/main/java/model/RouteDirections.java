package model;

import java.util.List;

public class RouteDirections {
  String overviewPolyline;
  List<String> HTMLDirections;

  public RouteDirections(String overviewPolyline, List<String> HTMLDirections) {
    this.overviewPolyline = overviewPolyline;
    this.HTMLDirections = HTMLDirections;
  }
}
