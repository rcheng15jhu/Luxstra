package persistence;

import exception.DaoException;
import model.Light;

import java.util.List;
import java.util.stream.Stream;

public interface LightDao {
  int add(Light l) throws DaoException;
  List<Integer> addBatch(Stream<Light> ls) throws DaoException;
  List<Light> listAll() throws DaoException;
  List<Light> listFromStreetName() throws DaoException;
  boolean delete(Light l) throws DaoException;
}
