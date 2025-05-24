import dbConnectionFunc from "../dbconnection/dbconnection.js";

async function getRole(_, res) {
  console.log("getRole (+)");

  let dbconnect;

  try {
    dbconnect = await dbConnectionFunc();

    const result = await getRoleDetail(dbconnect);

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

  console.log("getRole (-)");
}

async function getRoleDetail(dbconnect) {
  console.log("getRoleDetail (+)");

  return new Promise((res, rej) => {
    const sqlQuery = `select distinct user_role 
                        from addnewuser`;

    dbconnect.query(sqlQuery, (err, result) => {
      if (err) {
        rej({
          status: "E",
          message: err.message,
        });
      } else {
        const roleArr = result.map((val) => {
          return val.user_role;
        });

        res({
          status: "S",
          roleArr: roleArr,
        });
      }
    });

    console.log("getRoleDetail (-)");
  });
}

export default getRole;
