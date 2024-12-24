const http = require("http");
const fs = require("fs");
// get array of users from json file
const users = require("./users.json").users;
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
      } else {
        //parse data then assign it users
        const users = JSON.parse(data);
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(users));
      }
    });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});
