const http = require("http");
const fs = require("fs");
const path = require("path");
const users = require("./users");

const PORT = 3000;
const HOST = "localhost";

const server = http.createServer();

server.on("request", (req, res) => {
  if (["/", "/index.html"].includes(req.url)) {
    fs.readFile("./index.html", "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.write("Internal Server Error");
        res.end();
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    });
  } else if (req.url === "/assets/favicon2.ico") {
    fs.createReadStream(path.join(__dirname, req.url)).pipe(res);
  } else if (req.url === "/index.js") {
    fs.createReadStream(path.join(__dirname, req.url)).pipe(res);
  } else if (req.url === "/users") {
    if ( req.method === "GET" ) {
      users.getUsers(req, res)
    } else if (req.method === "POST") {
      users.addUser(req, res)
    } else {
      res.writeHead(405, { "Content-Type": "text/plain" });
      res.write("Method Not Allowed");
      res.end();
    };
  }
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.write("404 not found");
    res.end();
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on: http://${HOST}:${PORT}`);
});
