package services;

import com.google.android.libraries.maps.model.LatLng;

public class Distance {

  public static double getDistance(LatLng a, LatLng b) {
    return (b.lng -a.lng)*(b.lng -a.lng) + (b.lat -a.lat)*(b.lat -a.lat);
  }

}
