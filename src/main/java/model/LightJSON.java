package model;

import java.util.List;
import java.util.stream.Stream;

public class LightJSON {
  List<Light> table;

  public List<Light> getTable() {
    return table;
  }

  public void setTable(List<Light> table) {
    this.table = table;
  }

  public Stream<Light> getLightStream() {
    return table.stream();
  }
}
