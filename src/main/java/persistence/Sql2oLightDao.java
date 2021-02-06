package persistence;

import exception.DaoException;
import model.Light;
import org.sql2o.Sql2o;

import java.util.List;

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
  public List<Light> listAll() throws DaoException {
    return Transaction.execute(sql2o, (con) -> {
      String sql = "SELECT * FROM Lights";
      return con.createQuery(sql).executeAndFetch(Light.class);
    });
  }

  @Override
  public boolean delete(Light l) throws DaoException {
    throw new UnsupportedOperationException();
  }
}
