package services;
import com.google.android.libraries.maps.model.LatLng;

import java.lang.Math;
import java.util.ArrayList;

public class Rank {
    //Take coordinates of endpoints of lines and of lamp, as well as radius of light centered on lamp.
    //Output proportions of light where the resultant circle intersects the lines.
    public static Double[] intersectTimes(LatLng end1, LatLng end2, LatLng lamp, double r)
    {
        double a = ((end2.latitude -end1.latitude)*(end2.latitude -end1.latitude)+(end2.longitude -end1.longitude)*(end2.longitude -end1.longitude));
        double b = ((end1.latitude -lamp.latitude)*(end2.latitude -end1.latitude)+(end1.longitude -lamp.longitude)*(end2.longitude -end1.longitude));
        double c = ((end1.latitude -lamp.latitude)*(end1.latitude -lamp.latitude)+(end1.longitude -lamp.longitude)*(end1.longitude -lamp.longitude)-r*r);
        double discriminant = b * b - a * c;
        double root = Math.sqrt(discriminant);

        if(discriminant < 0) {
            Double[] t = {(Double)(-1.0), (Double)(-1.0)};
            return t;
        } else {
            Double[] t = {(Double)(-b - root)/a,(Double)(-b + root)/a};
            return t;
        }
    }

    //Take coordinates of endpoints of lines and proportions of intersections.
    //Output coordinates of intersections.
    public static LatLng[] intersections(LatLng end1, LatLng end2, Double[] times)
    {
        LatLng[] ints = new LatLng[2];
        for(int i = 0; i < 2; i++)
        {
            ints[i] = new LatLng(end1.latitude + (end2.latitude - end1.latitude) * times[i],
                    end1.longitude + (end2.longitude - end1.longitude) * times[i]);
        }
        return ints;
    }

    public static ArrayList<Double[]> pruneRedundant(ArrayList<Double[]> input)
    {
        ArrayList<Double[]> output = new ArrayList<>(0);
        for (Double[] doubles : input) {
            if (doubles[0] > 1 || doubles[1] < 0) {
                continue;
            } else {
                if (doubles[0] < 0) {
                    doubles[0] = 0.0;
                }
                if (doubles[1] > 1) {
                    doubles[1] = 1.0;
                }
            }

            int leftSideIsIn = -1;
            int leftSideAt = -1;
            int rightSideIsIn = -1;
            int rightSideAt = -1;
            for (int j = 0; j < output.size(); j++) {
                if (doubles[0] > output.get(j)[0]) {
                    if (doubles[0] < output.get(j)[1]) {
                        leftSideIsIn = j;
                    }
                    leftSideAt = j;
                }
                if (doubles[1] < output.get(j)[1]) {
                    if (doubles[1] > output.get(j)[0]) {
                        rightSideIsIn = j;
                    }
                    rightSideAt = j;
                }
            }

            if (leftSideIsIn > -1) {
                if (rightSideIsIn > -1) {
                    output.get(leftSideIsIn)[1] = output.get(rightSideIsIn)[1];
//                    for (int j = rightSideIsIn; j > leftSideIsIn; j--) {
//                        output.remove(j);
//                    }
                    if (rightSideIsIn >= leftSideIsIn + 1) {
                        output.subList(leftSideIsIn + 1, rightSideIsIn + 1).clear();
                    }
                } else {
                    output.get(leftSideIsIn)[1] = doubles[1];
                    if (rightSideAt > leftSideIsIn + 1) {
                        output.subList(leftSideIsIn + 1, rightSideAt).clear();
                    }
                }
            } else {
                if (rightSideIsIn > -1) {
                    output.get(rightSideIsIn)[0] = doubles[0];
                    if (rightSideIsIn > leftSideAt + 1) {
                        output.subList(leftSideAt + 1, rightSideIsIn).clear();
                    }
                } else {
                    if (rightSideAt >= leftSideAt + 1) {
                        output.subList(leftSideAt + 1, rightSideAt + 1).clear();
                    }
                    Double[] temp = {doubles[0], doubles[1]};
                    output.add(leftSideAt + 1, temp);
                }
            }

        }
        return input;
    }
}
