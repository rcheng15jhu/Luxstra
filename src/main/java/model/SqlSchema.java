package model;

public class SqlSchema {

  public static String LightsSchema = "CREATE TABLE IF NOT EXISTS Lights (" +
          " id             serial PRIMARY KEY," +
          " latitude            NUMERIC(10, 7) NOT NULL," +
          " longitude            NUMERIC(10, 7) NOT NULL," +
          " street         VARCHAR(100)," +
          " street_number  VARCHAR(100)" +
          ");";

}
