package model;

public class SqlSchema {

  public static String LightsSchema = "CREATE TABLE IF NOT EXISTS Lights (" +
          " id            serial PRIMARY KEY," +
          " name          VARCHAR(100) NOT NULL UNIQUE," +
          " password      VARCHAR(48) NOT NULL," +
          " salt          VARCHAR(36) NOT NULL," +
          " email          VARCHAR(100) NOT NULL," +
          " affil          VARCHAR(100) NOT NULL," +
          " title          VARCHAR(200) NOT NULL," +
          " description   VARCHAR(1000) NOT NULL," +
          " pic          VARCHAR(100) NOT NULL" +
          ");";



}
