import dbConnectionFunc from "../dbconnection/dbconnection.js";

async function insertNewMedicineStock(req, res) {
  console.log("insertNewMedicineStock (+)");

  let dbconnect;

  try {
    dbconnect = await dbConnectionFunc();

    const result = await insertMedicine(dbconnect, req.body);

    if (result.status === "E") {
      res.status(201).json(result);
    } else {
      res.status(201).json(result);
    }
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (dbconnect) {
      dbconnect.end((err) => {
        if (err) {
          res.status(500).json({
            status: "E",
            errMsg: err,
          });
        }
      });
    }
  }

  console.log("insertNewMedicineStock (-)");
}

function insertMedicine(dbconnect, body) {
  console.log("insertMedicine (+)");

  const insertQuery = `insert into medicinelist (medicinename, quantity, brand, unitprice)
                        values (?, ?, ?, ?)`;

  return new Promise((resolve, reject) => {
    dbconnect.query(
      insertQuery,
      [
        body.medicinename,
        parseInt(body.quantity),
        body.brand,
        parseFloat(body.unitprice),
      ],
      (err, _) => {
        if (err) {
          reject({
            status: "E",
            errMsg: err.sqlMessage,
          });
        } else {
          resolve({
            status: "S",
            msg: "Inserted SuccessFully",
          });
        }
      }
    );

    console.log("insertMedicine (-)");
  });
}

export default insertNewMedicineStock;
