package persistence;

import exception.DaoException;
import model.Light;
import org.sql2o.Query;
import org.sql2o.Sql2o;

import java.util.List;
import java.util.stream.Stream;

public class Sql2oLightDao implements LightDao {
  private final Sql2o sql2o;

  public Sql2oLightDao(Sql2o sql2o) {
    this.sql2o = sql2o;
  }


  @Override
  public int add(Light l) throws DaoException {
    throw new UnsupportedOperationException();
  }

  @Override
  public List<Integer> addBatch(Stream<Light> ls) throws DaoException {
    return Transaction.execute(sql2o, (con) -> {
      String query = "INSERT INTO Lights (lat, lng, street, street_number)"
              + "VALUES (:lat, :lng, :street, :street_number)";

      Query q = con.createQuery(query, true);

      ls.forEachOrdered(avail -> {
        q.bind(avail).addToBatch();
      });

      List<Integer> ids = q.executeBatch().getKeys(Integer.class);
      return ids;
    });
  }

  @Override
  public List<Light> listAll() throws DaoException {
    return Transaction.execute(sql2o, (con) -> {
      String sql = "SELECT * FROM Lights";
      return con.createQuery(sql).executeAndFetch(Light.class);
    });
  }

  @Override
  public List<Light> listFromStreetName(String street) throws DaoException {
    return Transaction.execute(sql2o, (con) -> {
      String sql = "SELECT * FROM Lights WHERE street = :street";
      return con.createQuery(sql)
        .addParameter("street", street)
        .executeAndFetch(Light.class);
    });
  }

  @Override
  public boolean delete(Light l) throws DaoException {
    throw new UnsupportedOperationException();
  }
}
