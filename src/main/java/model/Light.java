package model;

import com.google.android.*;
import com.google.android.libraries.maps.model.LatLng;

import java.math.BigDecimal;

public class Light {
  int id;
  BigDecimal lat;
  BigDecimal lng;
  String street;
  String street_number;
  public int segment;

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public BigDecimal getLat() {
    return lat;
  }

  public BigDecimal getLng() {
    return lng;
  }

  public LatLng getLatLng() {
    return new LatLng(lat.doubleValue(), lng.doubleValue());
  }

  public String getStreet() {
    return street;
  }

  public String getStreet_number() {
    return street_number;
  }

  @Override
  public String toString() {
    return "Light{" +
            "latitude=" + lat +
            ", longitude=" + lng +
            ", street='" + street + '\'' +
            ", street_number='" + street_number + '\'' +
            ", segment=" + segment +
            '}';
  }
}
