import dbConnectionFunc from "../dbconnection/dbconnection.js";

async function logoutAuth(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  console.log("logoutAuth (+)");

  let dbconnect;

  try {
    dbconnect = await dbConnectionFunc();

    const body = req.body;

    if (!body.username || !body.userId) {
      res.status(201).json({
        status: "E",
        errMsg: "Invalid Request",
      });
    } else {
      const result = await updateLogoutUser(dbconnect, body);

      if (result.status === "E") {
        res.status(201).json(result);
      } else {
        res.status(201).json(result);
      }
    }
  } catch (err) {
    res.status(200).json({
      status: "E",
      errMsg: err,
    });
  } finally {
    if (dbconnect) {
      dbconnect.end((err) => {
        if (err) {
          res.status(200).json({
            status: "E",
            errMsg: err,
          });
        }
      });
    }
  }

  console.log("logoutAuth (-)");
}

async function updateLogoutUser(dbconnect, body) {
  console.log("updateLogoutUser (+)");

  return await new Promise((res, rej) => {
    const sqlQuery = `update loginmeduser
                        set flag = 'N', login_logout = 'logout'
                        where id = ? and username = ?`;

    dbconnect.query(sqlQuery, [body.userId, body.username], (err, result) => {
      if (err) {
        rej({
          status: "E",
          message: err.message,
        });
      } else {
        if (result.affectedRows === 0) {
          res({
            status: "E",
            errMsg: "Username is not defined",
          });
        } else {
          res({
            status: "S",
            msg: "LogoutSuccessfully",
          });
        }
      }
    });

    console.log("updateLogoutUser (-)");
  });
}

export default logoutAuth;
