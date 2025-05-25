import dbConnectionFunc from "../dbconnection/dbconnection.js";

async function updateMedicines(req, res) {
  console.log("updateMedicines (+)");

  let dbconnect;

  try {
    dbconnect = await dbConnectionFunc();

    const result = await updateMedicinesQuery(dbconnect, req.body);

    if (result.status === "E") {
      res.status(201).json(result);
    } else {
      res.status(201).json(result);
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

  console.log("updateMedicines (-)");
}

async function updateMedicinesQuery(dbconnect, body) {
  console.log("updateMedicinesQuery (+)");

  console.log(body);

  const insertQuery = `update medicinelist
                        set medicinename = ?, quantity = quantity+?, brand = ?, unitprice = unitprice+?
                        where id = ?`;

  return new Promise((resolve, reject) => {
    dbconnect.query(
      insertQuery,
      [
        body.medicinename,
        parseInt(body.quantity),
        body.brand,
        parseFloat(body.unitprice),
        body.id,
      ],
      (err, result) => {
        if (err) {
          reject({
            status: "E",
            errMsg: err,
          });
        } else {
          resolve({
            status: "S",
            msg: "Updated SuccessFully",
          });
        }
      }
    );

    console.log("updateMedicinesQuery (-)");
  });
}

export default updateMedicines;
