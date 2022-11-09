import axios from "axios";
import userService from "./user";

const baseUrl = "/api/blogs";

// Configuration for axios
const config = () => {
  return {
    headers: {
      Authorization: `bearer ${userService.getToken()}`,
    },
  };
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, config());
  return response.data;
};

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject);
  return response.data;
};

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, config());
  return response.data;
};

const addComment = async (id, comment) => {
  const response = await axios.post(
    `${baseUrl}/${id}/comments`,
    comment,
    config()
  );

  return response.data;
};

const exportedObject = {
  getAll,
  create,
  update,
  remove,
  addComment,
};

export default exportedObject;
