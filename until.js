var fetchRequest = function (url, method, body) {
  return axios({
    url,
    method,
    data: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (res) {
      return res.data;
    })
    .catch(function (errors) {
      return errors;
    });
};

var $ = function (id) {
  return document.getElementById(id);
};

var URL = "http://localhost:4444/api";
