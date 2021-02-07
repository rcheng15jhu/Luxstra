package model;

import java.util.List;

public class ManyRoutes {
  List<Route> routes;

  public ManyRoutes(List<Route> routes) {
    this.routes = routes;
  }

  public List<Route> getRoutes() {
    return routes;
  }
}
