import dbConnectionFunc from "../dbconnection/dbconnection.js";

async function addNewUser(req, res) {
  console.log("addNewUser (+)");

  let dbconnect;

  try {
    dbconnect = await dbConnectionFunc();
    const body = req.body;

    if (!body.username || !body.password || !body.role) {
      res.status(201).json({
        status: "E",
        errMsg: "Invalid Request",
      });
    } else {
      const userPresent = await getUserRolePresent(dbconnect, body);

      if (userPresent.status === "E") {
        res.status(201).json(userPresent);
      } else {
        const result = await insertNewUserFunc(dbconnect, body);

        if (result.status === "E") {
          res.status(201).json(result);
        } else {
          res.status(201).json(result);
        }
      }
    }
  } catch (err) {
    res.status(500).json({
      status: "E",
      errMsg: err.message,
    });
  } finally {
    dbconnect.end((err) => {
      if (err) {
        res.status(500).json({
          status: "E",
          errMsg: err.message,
        });
      }
    });
  }

  console.log("addNewUser (-)");
}

async function getUserRolePresent(dbconnect, body) {
  console.log("getUserRolePresent (+)");

  return await new Promise((res, rej) => {
    const sqlQuery = `select username, user_password 
                     from addnewuser
                     where (username = ? and user_role = ?) or user_password = ?`;

    dbconnect.query(
      sqlQuery,
      [body.username, body.role, body.password],
      (err, result) => {
        if (err) {
          rej({
            status: "E",
            message: err.message,
          });
        } else {
          if (result.length !== 0) {
            if (result[0].user_password === body.password) {
              res({
                status: "E",
                errMsg: "Password is already present",
              });
            } else {
              res({
                status: "E",
                errMsg: "UserRole is already present",
              });
            }
          } else {
            res({
              status: "S",
            });
          }
        }
      }
    );

    console.log("getUserRolePresent (-)");
  });
}

async function insertNewUserFunc(dbconnect, body) {
  console.log("insertNewUserFunc (+)");

  return await new Promise((res, rej) => {
    const sqlQuery = `insert into addnewuser (username, user_password, user_role)\
                      values(?, ?, ?)`;

    dbconnect.query(
      sqlQuery,
      [body.username, body.password, body.role],
      (err, _) => {
        if (err) {
          rej({
            status: "E",
            message: err.message,
          });
        } else {
          res({
            status: "S",
            msg: "Inserted successfully",
          });
        }
      }
    );

    console.log("insertNewUserFunc (-)");
  });
}

export default addNewUser;
