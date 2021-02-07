package services;

import com.google.android.libraries.maps.model.LatLng;

public class Distance {

  public static double getDistance(LatLng a, LatLng b) {
    return (b.longitude -a.longitude)*(b.longitude -a.longitude) + (b.latitude -a.latitude)*(b.latitude -a.latitude);
  }

}
