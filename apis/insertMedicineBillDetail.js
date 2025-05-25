import dbConnectionFunc from "../dbconnection/dbconnection.js";

async function insertMedicineBillDetail(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  console.log("insertMedicineBillDetail (+)");

  const medBillRespStruct = {
    status: "",
    errMsg: "",
  };

  medBillRespStruct.status = "S";
  const body = req.body;
  let dbconnect;

  try {
    dbconnect = await dbConnectionFunc();
    const { result, status } = await getBillEntryId(
      dbconnect,
      medBillRespStruct
    );

    if (status === "E") {
      medBillRespStruct.status = "E";
      medBillRespStruct.errMsg = "Unexpected Error Occur";
      res.status(201).json(medBillRespStruct);
    } else {
      const response = await insertMedQueryFunc(
        dbconnect,
        body,
        result[0].billId,
        medBillRespStruct
      );

      console.log("response", response);

      if (response.status === "E") {
        medBillRespStruct.status = "E";
        medBillRespStruct.errMsg = response.errMsg;
        res.status(201).json(medBillRespStruct);
      } else {
        const response = await updateMedicineQty(
          dbconnect,
          result[0].billId,
          medBillRespStruct
        );
        console.log(response);

        if (response.status === "E") {
          console.log("err5", response.errMsg);
          medBillRespStruct.status = "E";
          medBillRespStruct.errMsg = response.errMsg;
          res.status(201).json(medBillRespStruct);
        } else {
          medBillRespStruct.status = "S";
          return res.status(201).json(medBillRespStruct);
        }
      }
    }
  } catch (err) {
    console.log("errcatch", err || err.message);
    medBillRespStruct.status = "E";
    medBillRespStruct.errMsg = err;
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

  console.log("insertMedicineBillDetail (-)");
}

async function getBillEntryId(dbconnect, medBillRespStruct) {
  console.log("getBillEntryId (+)");

  const sqlQuery = `select count(*) as billId from billentrydetails`;

  return await new Promise((resolve, reject) => {
    dbconnect.query(sqlQuery, (err, result) => {
      console.log("err11", err);
      if (err) {
        medBillRespStruct.status = "E";
        medBillRespStruct.errMsg = err;
        reject(medBillRespStruct);
      } else {
        medBillRespStruct.status = "S";
        resolve({ result, status: "S" });
      }
    });

    console.log("getBillEntryId (-)");
  });
}

async function insertMedQueryFunc(dbconnect, body, billId, medBillRespStruct) {
  console.log("insertMedQueryFunc (+)");

  const sqlQuery = `insert into medicinebilldetails (medicine_name, quantity, brand, unitprice, amount, medicine_id, bill_detail_id)
                    values (?, ?, ?, ?, ?, ?, ?)`;

  return new Promise((resolve, reject) => {
    body.forEach((val) => {
      dbconnect.query(
        sqlQuery,
        [
          val.medicinename,
          val.quantity,
          val.brand,
          val.unitprice,
          val.amount,
          val.id,
          billId,
        ],
        (err, _) => {
          console.log("err12", err);

          if (err) {
            medBillRespStruct.status = "E";
            medBillRespStruct.errMsg = err;
            reject(err);
          } else {
            medBillRespStruct.status = "S";
            resolve(medBillRespStruct);
          }
        }
      );
    });

    console.log("insertMedQueryFunc (-)");
  });
}

// async function insertMedQueryFunc(dbconnect, body, billId, medBillRespStruct) {
//   console.log("insertMedQueryFunc (+)");

//   const sqlQuery = `INSERT INTO medicinebilldetails
//     (medicine_name, quantity, brand, unitprice, amount, medicine_id, bill_detail_id)
//     VALUES (?, ?, ?, ?, ?, ?, ?)`;

//   try {
//     const insertPromises = body.map((val) => {
//       return new Promise((resolve, reject) => {
//         dbconnect.query(
//           sqlQuery,
//           [
//             val.medicinename,
//             val.quantity,
//             val.brand,
//             val.unitprice,
//             val.amount,
//             val.id,
//             billId,
//           ],
//           (err, result) => {
//             if (err) {
//               console.log("Insert error:", err);
//               return reject(err);
//             }
//             resolve(result);
//           }
//         );
//       });
//     });

//     await Promise.all(insertPromises);

//     medBillRespStruct.status = "S";
//     medBillRespStruct.errMsg = null;

//     console.log("insertMedQueryFunc (-)");
//     return medBillRespStruct;
//   } catch (err) {
//     medBillRespStruct.status = "E";
//     medBillRespStruct.errMsg = err;
//     return medBillRespStruct;
//   }
// }

async function updateMedicineQty(dbconnect, billId, medBillRespStruct) {
  console.log("updateMedicineQty (+)");

  const sqlQuery = `update medicinelist ml
  join (
      select medicine_id, sum(quantity) as total_quantity
      from dev.medicinebilldetails
      where bill_detail_id = ?
      group by medicine_id
  ) mbd_sum
  on ml.id = mbd_sum.medicine_id
  set ml.quantity = ml.quantity - mbd_sum.total_quantity;
  `;

  return new Promise((resolve, reject) => {
    dbconnect.query(sqlQuery, [billId], (err, result) => {
      if (err) {
        medBillRespStruct.status = "E";
        medBillRespStruct.errMsg = err;
        reject(err);
      } else {
        medBillRespStruct.status = "S";
        resolve(medBillRespStruct);
      }
    });

    console.log("updateMedicineQty (-)");
  });
}

export default insertMedicineBillDetail;
