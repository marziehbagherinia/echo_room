const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getBaseUrl = () => {
  let baseUrl = process.env.REACT_APP_AUTH_SERVICE_URL;

  if ( baseUrl.endsWith('/') ) {
    return baseUrl.slice(0, -1);
  }
  return baseUrl;
};

const createRoomMember = (data) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.token}`
  };

  const body = {
    type: data.type ? data.type : "guest"
  };

  axios.post(`${getBaseUrl()}/api/v1/rooms/${data.path}/members`, body, { headers }).then(response => {}).catch(error => {});
};

const leftRoom = (data) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.token}`
  };

  axios.get(`${getBaseUrl()}/api/v1/rooms/${data.path}/members/left?type=${data.type}`, { headers }).then(response => {}).catch(error => {});
};

const getAllGroups = async () => {
  const response = await axios.get(`${getBaseUrl()}/api/v1/groups`);

  if ( response.status !== 200 || !response.data.data ) {
    throw new Error('Index groups failed');
  }

  return response.data.data;
};

module.exports = { createRoomMember, leftRoom, getAllGroups };
