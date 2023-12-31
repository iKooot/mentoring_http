const fs = require("fs");
const { faker } = require("@faker-js/faker");
const { parse } = require("node:querystring");

// you can use path module
const USERS_DATA_FILE_PATH = "data/users.json";

const getUsers = (req, res) => {
  fs.readFile(USERS_DATA_FILE_PATH, "utf-8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.write("Internal Server Error");
      res.end();
      return;
    }

    try {
      const users = JSON.parse(data);
      res.write(JSON.stringify(users));
      res.end();
    } catch (e) {
      console.log(e);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.write("Invalid JSON data");
      res.end();
    }
  });
};

const addUser = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const newUser = JSON.parse(body);
    newUser._id = faker.database.mongodbObjectId();

    fs.readFile(USERS_DATA_FILE_PATH, "utf-8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          const users = [newUser];
          fs.writeFile(
            USERS_DATA_FILE_PATH,
            JSON.stringify(users),
            "utf-8",
            (err) => {
              if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.write("Invalid Server Error");
                res.end();
                return;
              }

              res.writeHead(201, { "Contest-Type": "text/plain" });
              res.write("User successfully added");
              res.end();
            },
          );
        } else {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.write("Invalid Server Error");
          res.end();
        }
        return;
      }

      const users = JSON.parse(data);
      users.push(newUser);

      fs.writeFile(
        USERS_DATA_FILE_PATH,
        JSON.stringify(users),
        "utf-8",
        (err) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write("Invalid Server Error");
            res.end();
            return;
          }

          res.writeHead(201, { "Contest-Type": "text/plain" });
          res.write("User successfully added");
          res.end();
        },
      );
    });
  });
};

const updateUser = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const updateUserData = JSON.parse(body);
    const { id } = parse(req.url.split("?")[1]);

    fs.readFile(USERS_DATA_FILE_PATH, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.write("Internal cant read data file");
        res.end();
        return;
      }
      const users = JSON.parse(data);
      const updatedUser = users.find((users) => users._id === id);

      if (!updatedUser) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write(`Can't to find user with id: ${id}`);
        res.end();
        return;
      }

      Object.assign(updatedUser, updateUserData);

      fs.writeFile(
        USERS_DATA_FILE_PATH,
        JSON.stringify(users),
        "utf-8",
        (err) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write("Invalid Server Error");
            res.end();
            return;
          }

          res.writeHead(201, { "Contest-Type": "text/plain" });
          res.write("User successfully updated");
          res.end();
        },
      );
    });
  });
};

const deleteUser = (req, res) => {
  const id = new URL(req.url, "http://localhost:3000").searchParams.get("id");

  fs.readFile(USERS_DATA_FILE_PATH, "utf-8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.write("Internal cant read data file");
      res.end();
      return;
    }
    const users = JSON.parse(data);
    const updatedUser = users.find((users) => users._id === id);

    if (!updatedUser) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write(`Can't to find user with id: ${id}`);
      res.end();
      return;
    }

    const newUsers = users.filter((user) => user._id !== id);

    fs.writeFile(
      USERS_DATA_FILE_PATH,
      JSON.stringify(newUsers),
      "utf-8",
      (err) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.write("Invalid Server Error");
          res.end();
          return;
        }

        res.writeHead(201, { "Contest-Type": "text/plain" });
        res.write("User successfully deleted");
        res.end();
      },
    );
  });
};

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
};
