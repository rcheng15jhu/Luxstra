import static spark.Spark.*;

import com.google.gson.Gson;
import com.google.maps.DirectionsApi;
import com.google.maps.GeoApiContext;
import com.google.maps.model.DirectionsResult;
import com.google.maps.model.DirectionsRoute;
import com.google.maps.android.PolyUtil;
import com.google.android.libraries.maps.model.LatLng;
import com.google.maps.model.TravelMode;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import io.github.cdimascio.dotenv.Dotenv;
import model.*;
import org.sql2o.Sql2o;
import org.sql2o.Sql2oException;
import org.sql2o.quirks.PostgresQuirks;
import persistence.Sql2oLightDao;
import services.Rank;
import spark.Spark;
import spark.utils.IOUtils;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.stream.Collectors;

import static model.SqlSchema.*;

public class Server {

  private static Sql2o sql2o;

  private static GeoApiContext context;

  private static List<Light> lights;

  private static Sql2o getSql2o() {
    if(sql2o == null) {
      // create data source - update to use postgresql
      try {
        Properties props = getDbUrl(System.getenv("DATABASE_URL"));
        sql2o = new Sql2o(new HikariDataSource(new HikariConfig(props)), new PostgresQuirks());
        //sql2o = new Sql2o(props.getProperty("jdbcUrl"), props.getProperty("username"), props.getProperty("password"));
      } catch(URISyntaxException | Sql2oException e) {
        e.printStackTrace();
      }

      try (org.sql2o.Connection con = sql2o.beginTransaction()) {
        con.createQuery(LightsSchema).executeUpdate();
        con.commit();
      } catch (Sql2oException e) {
        e.printStackTrace();
      }
    }

    return sql2o;
  }

  private static Properties getDbUrl(String databaseUrl) throws URISyntaxException {
    Properties props = new Properties();
    if (databaseUrl == null) {
      Dotenv dotenv = Dotenv.load();
      props.setProperty("username", dotenv.get("DEV_DB_USER"));
      props.setProperty("password", dotenv.get("DEV_DB_PWORD"));
      props.setProperty("jdbcUrl",  dotenv.get("DEV_DB_URL"));
    } else {
      URI dbUri = new URI(databaseUrl);

      props.setProperty("username", dbUri.getUserInfo().split(":")[0]);
      props.setProperty("password", dbUri.getUserInfo().split(":")[1]);
      props.setProperty("jdbcUrl",  "jdbc:postgresql://" + dbUri.getHost() + ':'
              + dbUri.getPort() + dbUri.getPath() + "?sslmode=require");
    }

    return props;
  }

  final static int PORT_NUM = 7000;
  private static int getHerokuAssignedPort() {
    String herokuPort = System.getenv("PORT");
    if (herokuPort != null) {
      return Integer.parseInt(herokuPort);
    }
    return PORT_NUM;
  }

  public static GeoApiContext getGeoAPIContext() {
    if(context == null) {
      String apiKey = System.getenv("API_KEY");
      if(apiKey == null) {
        Dotenv dotenv = Dotenv.load();
        apiKey = dotenv.get("DEV_API_KEY");
      }
      context = new GeoApiContext.Builder()
              .apiKey(apiKey)
              .build();
    }
    return context;
  }

  public static void getLights() {
    lights = new Sql2oLightDao(getSql2o()).listAll();
  }

  public static void main(String[] args) {
    // set port number
    port(getHerokuAssignedPort());

    getSql2o();

    getGeoAPIContext();

    getLights();

    staticFiles.location("/");

    get("", (req, res) -> {
      res.status(200);
      res.type("text/html");

      return IOUtils.toString(Spark.class.getResourceAsStream("/index.html"));
    });

    get("/", (req, res) -> {
      res.status(200);
      res.type("text/html");

      return IOUtils.toString(Spark.class.getResourceAsStream("/index.html"));
    });

    notFound((req, res) -> {
      res.status(200);
      res.type("text/html");

      return IOUtils.toString(Spark.class.getResourceAsStream("/index.html"));
    });

    get("/api/lights_from_street", (req, res) -> {
      res.status(200);
      res.type("application/json");

      String name = req.queryParams("name");

      String results = new Gson().toJson(new Sql2oLightDao(getSql2o()).listFromStreetName(name));

      return results;
    });

    get("/api/fetch_route_coords", (req, res) -> {
      res.status(200);
      res.type("application/json");

      String start = req.queryParams("start");
      String end = req.queryParams("end");

      DirectionsResult directionsResult = DirectionsApi.getDirections(getGeoAPIContext(), start, end)
              .alternatives(true)
              .mode(TravelMode.WALKING)
              .await();
      DirectionsRoute[] routes = directionsResult.routes;

      System.out.println(routes.length);


      String latLngs = new Gson().toJson(new PathLatLngs(Arrays.stream(routes)
              .map(route -> Arrays.stream(route.legs)
                    .map(leg -> Arrays.stream(leg.steps)
                          .map(step -> step.polyline.decodePath())
                          .collect(Collectors.toList())
                    ).collect(Collectors.toList())
              ).collect(Collectors.toList())));

      return latLngs;
    });

    get("/api/fetch_route_directions", (req, res) -> {
      res.status(200);
      res.type("application/json");

      String start = req.queryParams("start");
      String end = req.queryParams("end");

      DirectionsResult directionsResult = DirectionsApi.getDirections(getGeoAPIContext(), start, end)
              .alternatives(true)
              .mode(TravelMode.WALKING)
              .await();
      DirectionsRoute[] routes = directionsResult.routes;


      String directions = new Gson().toJson(new ManyRouteDirections(Arrays.stream(routes)
              .map(route -> new RouteDirections(
                      route.summary,
                      route.overviewPolyline.decodePath(),
                      Arrays.stream(route.legs)
                            .flatMap(leg -> Arrays.stream(leg.steps)
                                    .map(step -> step.htmlInstructions)
                            ).collect(Collectors.toList())
                )
              ).collect(Collectors.toList())
      ));

      return directions;
    });

    get("/api/analyse_paths", (req, res) -> {
      res.status(200);
      res.type("application/json");

      String start = req.queryParams("start");
      String end = req.queryParams("end");

      DirectionsResult directionsResult = DirectionsApi.getDirections(getGeoAPIContext(), start, end)
              .alternatives(true)
              .mode(TravelMode.WALKING)
              .await();
      DirectionsRoute[] respRoutes = directionsResult.routes;


      ManyRoutes routesToAnalyse = new ManyRoutes(Arrays.stream(respRoutes)
              .map(route -> new Route(
                      route.summary,
                      route.overviewPolyline.decodePath(),
                      Arrays.stream(route.legs)
                              .flatMap(leg -> Arrays.stream(leg.steps)
                                      .map(step -> step.htmlInstructions)
                              ).collect(Collectors.toList())))
              .collect(Collectors.toList()));

      for(Route route : routesToAnalyse.getRoutes()) {
        List<Light> lightsToWorkWith = lights.parallelStream().filter(light -> {
          light.segment = PolyUtil.locationIndexOnPath(light.getLatLng(), route.getOverviewPolyline(), true, 4);//4 meters
          return light.segment != -1;
        }).sorted(Comparator.comparingInt(light -> light.segment))
        //.peek(System.out::println)
        .collect(Collectors.toList());

        List<LatLng> polyline = route.getOverviewPolyline();
        int segmentSize = polyline.size() - 1;
        //make list of light coverages for each segment
        ArrayList<ArrayList<Double[]>> segmentLightCoverages = new ArrayList<>(polyline.size() - 1);
        for (int i = 0; i < segmentSize; i++){
          segmentLightCoverages.add(new ArrayList<>(1));
        }
        for(Light light : lightsToWorkWith) {
//          //intersect each line segment in route, with light
//          for(int i = 0; i < segmentSize; i++)
//          {
//            Double[] times = Rank.intersectTimes(polyline.get(i), polyline.get(i+1), light.getLatLng(), 0.05);
//            segmentLightCoverages.get(i).add(times);
//          }
          ArrayList<Double[]> temp = segmentLightCoverages.get(light.segment);
          temp.add(Rank.intersectTimes(polyline.get(light.segment),   polyline.get(light.segment+1), light.getLatLng(), 0.000043));// (4/1.1132+4/0.7871)/2*0.00001 degrees
          temp.add(Rank.intersectTimes(polyline.get(light.segment-1), polyline.get(light.segment),   light.getLatLng(), 0.000043));
          temp.add(Rank.intersectTimes(polyline.get(light.segment+1), polyline.get(light.segment+2), light.getLatLng(), 0.000043));

        }
        for(int i = 0; i < segmentSize; i++) {
          ArrayList<Double[]> temp = Rank.pruneRedundant(segmentLightCoverages.get(i));
//          segmentLightCoverages.remove(i);
//          segmentLightCoverages.add(i,temp);
          segmentLightCoverages.set(i, temp);
        }
        ArrayList<Double> lightProportions = new ArrayList<Double>(0);
        for(int i = 0; i < segmentSize; i++) {
          double proportion = 0.0;
          int numLightSegments = segmentLightCoverages.get(i).size();
          for(int j = 0; j < numLightSegments; j++) {
            Double[] lightSegmentInfo = segmentLightCoverages.get(i).get(j);
            proportion += (lightSegmentInfo[1] - lightSegmentInfo[0]);
          }
          lightProportions.add(proportion);
        }

        route.setSegmentLightCoverages(segmentLightCoverages);
        route.setLightProportions(lightProportions);

      }
      
      return new Gson().toJson(routesToAnalyse);
    });





//    try {
//      Reader reader = new BufferedReader(new InputStreamReader(Spark.class.getResourceAsStream("/out.json")));
//
//      LightJSON lightJSON = new Gson().fromJson(reader, LightJSON.class);
//
//      new Sql2oLightDao(getSql2o()).addBatch(lightJSON.getLightStream());
//    } catch(Exception e) {
//      e.printStackTrace();
//    }
  }

}
