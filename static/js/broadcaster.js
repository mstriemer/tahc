var users = [];

onconnect = function (e) {
  var port = e.ports[0];

  port.onmessage = function (e) {
    if (e.data.register) {
      users.push({
        username: e.data.register,
        port: port,
      });
    } else if (e.data.message && e.data.sender) {
      users.forEach(function (user) {
        if (user.username !== e.data.sender) {
          user.port.postMessage(e.data);
        }
      });
    }
  };

  port.start();
};
