package model;

import com.google.maps.model.LatLng;

import java.util.List;
import java.util.stream.Collectors;

public class Route {
  String summary;
  List<com.google.android.libraries.maps.model.LatLng> overviewPolyline;

  public Route(String summary, List<LatLng> overviewPolyline) {
    this.summary = summary;
    this.overviewPolyline = overviewPolyline.stream()
    .map(latLng -> new com.google.android.libraries.maps.model.LatLng(latLng.lat, latLng.lng))
    .collect(Collectors.toList());
  }

  public String getSummary() {
    return summary;
  }

  public List<com.google.android.libraries.maps.model.LatLng> getOverviewPolyline() {
    return overviewPolyline;
  }
}