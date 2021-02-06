package persistence;

import exception.DaoException;
import model.Light;

import java.util.List;

public interface LightDao {
  int add(Light l) throws DaoException;
  List<Light> listAll() throws DaoException;
  boolean delete(Light l) throws DaoException;
}
