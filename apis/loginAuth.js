import dbConnectionFunc from "../dbconnection/dbconnection.js";

async function loginAuth(req, res) {
  console.log("loginAuth (+)");

  let dbconnect;

  try {
    dbconnect = await dbConnectionFunc();

    const body = req.body;
    if (!body.username || !body.password) {
      res.status(201).json({
        status: "E",
        errMsg: "Invalid Request",
      });
    } else {
      const userPresent = await getUserPresent(dbconnect, body);

      if (userPresent.status === "E") {
        res.status(201).json(userPresent);
      } else {
        const result = await insertLoginDetails(dbconnect, body);

        if (result.status === "E") {
          res.status(201).json(result);
        } else {
          const userDetailRes = await getUserDetailFunc(dbconnect, result);

          if (userDetailRes.status === "E") {
            res.status(201).json(userDetailRes);
          } else {
            res.status(201).json(userDetailRes);
          }
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

  console.log("loginAuth (-)");
}

async function getUserPresent(dbconnect, body) {
  console.log("getUserPresent (+)");

  return await new Promise((res, rej) => {
    const sqlQuery = `select username 
                      from addnewuser
                      where username = ? and user_password = ?`;

    dbconnect.query(sqlQuery, [body.username, body.password], (err, result) => {
      if (err) {
        rej({
          status: "E",
          message: err.message,
        });
      } else {
        if (result.length === 0) {
          res({
            status: "E",
            errMsg: "User not found",
          });
        } else {
          res({
            status: "S",
          });
        }
      }
    });

    console.log("getUserPresent (-)");
  });
}

async function insertLoginDetails(dbconnect, body) {
  console.log("insertLoginDetails (+)");

  const now = new Date();

  const options = {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(now);

  return await new Promise((res, rej) => {
    const sqlQuery = `insert into loginmeduser (username, user_password, flag, login_logout, login_date)
                      values (?, ?, ?, ?, ?)`;

    dbconnect.query(
      sqlQuery,
      [body.username, body.password, "Y", "login", formattedDate],
      (err, result) => {
        if (err) {
          rej({
            status: "E",
            message: err.message,
          });
        } else {
          res(result.insertId);
        }
      }
    );

    console.log("insertLoginDetails (-)");
  });
}

async function getUserDetailFunc(dbconnect, userid) {
  console.log("getUserDetailFunc (+)");

  return await new Promise((res, rej) => {
    const sqlQuery = `select lg.id, lg.username, lg.login_date, au.user_role
                      from loginmeduser lg join addnewuser au
                      where lg.id = ? and lg.username = au.username`;

    dbconnect.query(sqlQuery, [userid], (err, result) => {
      if (err) {
        rej({
          status: "E",
          message: err.message,
        });
      } else {
        const userLoginDetail = {
          status: "S",
          userId: result[0].id,
          userName: result[0].username,
          role: result[0].user_role,
          date: result[0].login_date,
        };

        res(userLoginDetail);
      }
    });

    console.log("getUserDetailFunc (-)");
  });
}

export default loginAuth;
