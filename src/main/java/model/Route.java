package model;

import com.google.maps.model.LatLng;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Route {
  String summary;
  List<com.google.android.libraries.maps.model.LatLng> overviewPolyline;
  List<String> HTMLDirections;
  List<ArrayList<Double[]>> segmentLightCoverages;
  List<Double> lightProportions;

  public Route(String summary, List<LatLng> overviewPolyline, List<String> HTMLDirections) {
    this.summary = summary;
    this.overviewPolyline = overviewPolyline.stream()
        .map(latLng -> new com.google.android.libraries.maps.model.LatLng(latLng.lat, latLng.lng))
        .collect(Collectors.toList());
    this.HTMLDirections = HTMLDirections;
  }

  public String getSummary() {
    return summary;
  }

  public List<com.google.android.libraries.maps.model.LatLng> getOverviewPolyline() {
    return overviewPolyline;
  }

  public void setSegmentLightCoverages(List<ArrayList<Double[]>> segmentLightCoverages) {
    this.segmentLightCoverages = segmentLightCoverages;
  }

  public void setLightProportions(List<Double> lightProportions) {
    this.lightProportions = lightProportions;
  }
}