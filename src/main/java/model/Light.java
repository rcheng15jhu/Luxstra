package model;

import java.math.BigDecimal;

public class Light {
  int id;
  BigDecimal lat;
  BigDecimal lng;
  String street;
  String street_number;

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public BigDecimal getLat() {
    return lat;
  }

  public void setLat(BigDecimal lat) {
    this.lat = lat;
  }

  public BigDecimal getLng() {
    return lng;
  }

  public void setLng(BigDecimal lng) {
    this.lng = lng;
  }

  public String getStreet() {
    return street;
  }

  public void setStreet(String street) {
    this.street = street;
  }

  public String getStreet_number() {
    return street_number;
  }

  public void setStreet_number(String street_number) {
    this.street_number = street_number;
  }
}
