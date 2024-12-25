const http = require("http");
const fs = require("fs");
// const { URL } = require("url");
const querystring = require("querystring");
// get array of users from json file
const users = require("./users.json");
const { write, rmSync } = require("fs");
const validationCheck = require("./users-check");

const server = http.createServer((req, res) => {
  const { url, method } = req;
  if (url === "/users" && method === "POST") {
    let body = [];
    req.on("data", (chunk) => body.push(chunk));
    req.on("end", () => {
      const userData = JSON.parse(body.join(""));
      const userDataarr = [userData];
      // console.log(userDataarr);

      const validationErrors = validationCheck(userDataarr);
      // console.log(validationErrors.length);

      try {
        if (validationErrors.length !== 0) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(
            JSON.stringify({ message: "Invalid name, email, or full-name" })
          );
        } else {
          console.log(users);
          console.log(userData);

          users.push(userData);
          fs.writeFile("./users.json", JSON.stringify(users), (err) => {
            if (err) {
              res.writeHead(500, { "content-type": "application/json" });
              res.end(
                JSON.stringify({ message: "error with registering user" })
              );
            }
            res.writeHead(200, { "content-type": "application/json" });
            res.end(
              JSON.stringify({ message: "User registered successfully" })
            );
          });
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
  } else if (url === "/users" && method === "GET") {
    fs.readFile("./users.json", "utf-8", (err, data) => {
      if (err) {
        res.writeHead(404, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: err }));
        return;
      } else {
        //parse data then assign it users
        const users = JSON.parse(data);
        res.writeHead(200, { "content-type": "ap/7plication/json" });
        res.end(JSON.stringify(users));
      }
    });
  } else if (url.startsWith("/users") && method === "DELETE") {
    const query = url.split("?")[1];
    let obj = {};

    if (query) {
      const arr = query.split("&");
      arr.forEach((str) => {
        const item = str.split("=");
        obj[item[0]] = item[1];
      });
    }

    const deleteName = obj.username;
    if (!deleteName) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "No username provided" }));
      return;
    }

    const initialLength = users.length;
    const updatedUsers = users.filter((user) => user.username !== deleteName);

    if (updatedUsers.length < initialLength) {
      fs.writeFile(
        "./users.json",
        JSON.stringify(updatedUsers, null, 2),
        (err) => {
          if (err) {
            res.writeHead(500, { "content-type": "application/json" });
            res.end(JSON.stringify({ message: "Error updating users file" }));
            return;
          }
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify({ message: "User deleted successfully" }));
        }
      );
    } else {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(
        JSON.stringify({ message: "No user found with the provided username" })
      );
    }
  } else if (url === "/users/usernames" && method === "GET") {
    try {
      const usernames = users.map((user) => user.username);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(usernames));
    } catch (err) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: err }));
    }
  } else if (url === "/users/emails" && method === "GET") {
    try {
      const emails = users.map((user) => user.email);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(emails));
    } catch (err) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: err }));
    }
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});
