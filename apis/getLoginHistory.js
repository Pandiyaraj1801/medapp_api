import dbConnectionFunc from "../dbconnection/dbconnection.js";

async function getLoginHistory(_, res) {
  console.log("getLoginHistory (+)");

  let dbconnect;

  try {
    dbconnect = await dbConnectionFunc();

    const result = await getLoginHistoryFunc(dbconnect);

    if (result.status === "E") {
      res.status(200).json(result);
    } else {
      res.status(200).json(result);
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

  console.log("getLoginHistory (-)");
}

async function getLoginHistoryFunc(dbconnect) {
  console.log("getLoginHistoryFunc (+)");

  return new Promise((res, rej) => {
    const sqlQuery = `select lm.id, lm.username, lm.login_logout, lm.login_date, au.user_role
                        from loginmeduser lm join addnewuser au
                        on lm.user_password = au.user_password`;

    dbconnect.query(sqlQuery, (err, result) => {
      if (err) {
        rej({
          status: "E",
          message: err.message,
        });
      } else {
        const userLogins = result.map((val) => {
          return {
            id: val.id,
            userName: val.username,
            type: val.login_logout,
            date: val.login_date,
            role: val.user_role,
          };
        });

        res({
          status: "S",
          userLoginsResp: userLogins,
        });
      }
    });

    console.log("getLoginHistoryFunc (-)");
  });
}

export default getLoginHistory;
