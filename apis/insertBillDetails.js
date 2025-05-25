import dbConnectionFunc from "../dbconnection/dbconnection.js";

async function insertBillDetails(req, res) {
  console.log("insertBillDetails (+)");

  const billDetailRespStruct = {
    status: "",
    errMsg: "",
  };

  billDetailRespStruct.status = "S";
  const body = req.body;

  let dbconnect;
  try {
    dbconnect = await dbConnectionFunc();
    const insertResult = await insertMedBillQueryFunc(
      dbconnect,
      body,
      billDetailRespStruct
    );

    if (insertResult.status === "E") {
      billDetailRespStruct.status = "E";
      billDetailRespStruct.errMsg = insertResult.errMsg;
      res.status(201).json(billDetailRespStruct);
    } else {
      const updateResult = await updateBillNoQuery(
        dbconnect,
        insertResult.result.insertId,
        billDetailRespStruct
      );

      if (updateResult.status === "E") {
        billDetailRespStruct.status = "E";
        billDetailRespStruct.errMsg = updateResult.errMsg;
        res.status(201).json(billDetailRespStruct);
      } else {
        billDetailRespStruct.status = "S";
        res.status(201).json(billDetailRespStruct);
      }
    }
  } catch (err) {
    billDetailRespStruct.status = "E";
    billDetailRespStruct.errMsg = err;
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
}

async function insertMedBillQueryFunc(dbconnect, body, billDetailRespStruct) {
  console.log("insertMedBillQueryFunc (+)");

  const sqlQuery = `insert into billentrydetails (billno, billdate, total, gst, netpayable)
  values (?, ?, ?, ?, ?)`;

  return await new Promise((resolve, reject) => {
    dbconnect.query(
      sqlQuery,
      [1, body.date, body.total, body.gst, body.netpayable],
      (err, result) => {
        if (err) {
          billDetailRespStruct.status = "E";
          billDetailRespStruct.errMsg = err;
          reject(billDetailRespStruct);
        } else {
          billDetailRespStruct.status = "S";
          resolve({ result, status: "S" });
        }
      }
    );

    console.log("insertMedBillQueryFunc (-)");
  });
}

async function updateBillNoQuery(dbconnect, result, billDetailRespStruct) {
  console.log("updateBillNoQuery (+)");

  const sqlQuery = `update billentrydetails
                    set billno = ?
                    where id = ?`;

  return await new Promise((resolve, reject) => {
    dbconnect.query(sqlQuery, [result, result], (err, result) => {
      if (err) {
        billDetailRespStruct.status = "E";
        billDetailRespStruct.errMsg = err;
        reject(billDetailRespStruct);
      } else {
        billDetailRespStruct.status = "S";
        resolve(billDetailRespStruct);
      }
    });

    console.log("updateBillNoQuery (-)");
  });
}

export default insertBillDetails;
