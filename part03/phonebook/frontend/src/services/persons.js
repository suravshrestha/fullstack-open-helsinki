import axios from "axios";

const apiUrl = "/api/persons";

const create = (personObject) => {
  const req = axios.post(apiUrl, personObject);
  return req.then((res) => res.data);
};

const getAll = () => {
  const req = axios.get(apiUrl);
  return req.then((res) => res.data);
};

const update = (id, newObject) => {
  const req = axios.put(`${apiUrl}/${id}`, newObject);
  return req.then((res) => res.data);
};

const deletePerson = (id) => {
  return axios.delete(`${apiUrl}/${id}`);
};

export default {
  create,
  getAll,
  update,
  deletePerson,
};
