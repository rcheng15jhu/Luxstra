package services;
import com.google.android.libraries.maps.model.LatLng;

import java.lang.Math;
import java.util.ArrayList;

public class Rank {
    //Take coordinates of endpoints of lines and of lamp, as well as radius of light centered on lamp.
    //Output proportions of light where the resultant circle intersects the lines.
    public static Double[] intersectTimes(LatLng end1, LatLng end2, LatLng lamp, double r)
    {
        double a = ((end2.latitude-end1.latitude)*(end2.latitude-end1.latitude)+(end2.longitude-end1.longitude)*(end2.longitude-end1.longitude));
        double b = ((end1.latitude-lamp.latitude)*(end2.latitude-end1.latitude)+(end1.longitude-lamp.longitude)*(end2.longitude-end1.longitude));
        double c = ((end1.latitude-lamp.latitude)*(end1.latitude-lamp.latitude)+(end1.longitude-lamp.longitude)*(end1.longitude-lamp.longitude)-r*r);
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
            ints[i] = new LatLng(end1.latitude + (end2.latitude - end1.latitude) * Double.valueOf(times[i]),
                    end1.longitude + (end2.longitude - end1.longitude) * Double.valueOf(times[i]));
        }
        return ints;
    }

    public static ArrayList<Double[]> pruneRedundant(ArrayList<Double[]> input)
    {
        ArrayList<Double[]> output = new ArrayList<Double[]>(0);
        for(int i = 0; i < input.size(); i++) {
            if(input.get(i)[0] > 1 || input.get(i)[1] < 0) {
                continue;
            } else {
                if(input.get(i)[0] < 0) {
                    input.get(i)[0] = 0.0;
                }
                if(input.get(i)[1] > 1) {
                    input.get(i)[1] = 1.0;
                }
            }

            int leftSideIsIn = -1;
            int leftSideAt = -1;
            int rightSideIsIn = -1;
            int rightSideAt = -1;
            for(int j = 0; j < output.size(); j++) {
                if(input.get(i)[0] > output.get(j)[0]) {
                    if(input.get(i)[0] < output.get(j)[1]) {
                        leftSideIsIn = j;
                    }
                    leftSideAt = j;
                }
                if(input.get(i)[1] < output.get(j)[1]) {
                    if(input.get(i)[1] > output.get(j)[0]) {
                        rightSideIsIn = j;
                    }
                    rightSideAt = j;
                }
            }

            if(leftSideIsIn > -1) {
                if(rightSideIsIn > -1) {
                    output.get(leftSideIsIn)[1] = output.get(rightSideIsIn)[1];
                    for(int j = rightSideIsIn; j > leftSideIsIn; j--) {
                        output.remove(j);
                    }
                } else {
                    output.get(leftSideIsIn)[1] = input.get(i)[1];
                    for(int j = rightSideAt - 1; j > leftSideIsIn; j--) {
                        output.remove(j);
                    }
                }
            } else {
                if(rightSideIsIn > -1) {
                    output.get(rightSideIsIn)[0] = input.get(i)[0];
                    for(int j = rightSideIsIn - 1; j > leftSideAt; j--) {
                        output.remove(j);
                    }
                } else {
                    for(int j = rightSideAt; j > leftSideAt; j--) {
                        output.remove(j);
                    }
                    Double[] temp = {input.get(i)[0], input.get(i)[1]};
                    output.add(leftSideAt + 1, temp);
                }
            }

        }
        return input;
    }
}
