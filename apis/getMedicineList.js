import dbConnectionFunc from "../dbconnection/dbconnection.js";

async function getMedicineList(req, res) {
  console.log("getMedicineList (+)");

  const getMedicineStruct = {
    medicineArr: [],
    billno: "",
    status: "",
    errMsg: "",
  };

  getMedicineStruct.status = "S";
  let dbconnect;
  try {
    dbconnect = await dbConnectionFunc();

    const result = await getMedicineListQuery(dbconnect, getMedicineStruct);
    if (result.status === "E") {
      getMedicineStruct.status = "E";
      res.status(200).json(getMedicineStruct);
    } else {
      const result = await getBillId(dbconnect, getMedicineStruct);

      if (result.status === "E") {
        getMedicineStruct.status = "E";
        res.status(200).json(getMedicineStruct);
      } else {
        getMedicineStruct.status = "S";
        res.status(200).json(result);
      }
    }
  } catch (err) {
    getMedicineStruct.status = "E";
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

  console.log("getMedicineList (-)");
}

async function getMedicineListQuery(dbconnect, getMedicineStruct) {
  console.log("getMedicineListQuery (+)");

  const sqlQuery = `select id, medicinename, quantity, brand, unitprice
                    from medicinelist`;

  return await new Promise((resolve, reject) => {
    dbconnect.query(sqlQuery, (err, result) => {
      if (err) {
        getMedicineStruct.status = "E";
        getMedicineStruct.errMsg = err;
        reject(getMedicineStruct);
      } else {
        getMedicineStruct.medicineArr = result.map((val) => {
          const medData = {
            id: val.id,
            medicinename: val.medicinename,
            quantity: val.quantity,
            brand: val.brand,
            unitprice: val.unitprice,
          };

          return medData;
        });

        getMedicineStruct.status = "S";
        resolve(getMedicineStruct);
      }
    });

    console.log("getMedicineListQuery (-)");
  });
}

async function getBillId(dbconnect, getMedicineStruct) {
  console.log("getBillId (+)");

  const sqlQuery = `select billno
                    from billentrydetails`;

  return await new Promise((resolve, reject) => {
    dbconnect.query(sqlQuery, (err, result) => {
      if (err) {
        getMedicineStruct.status = "E";
        getMedicineStruct.errMsg = err;
        reject(getMedicineStruct);
      } else {
        if (result.length === 0) {
          getMedicineStruct.billno = 1;
        } else {
          getMedicineStruct.billno = result[result.length - 1].billno + 1;
        }

        getMedicineStruct.status = "S";
        resolve(getMedicineStruct);
      }
    });

    console.log("getBillId (-)");
  });
}

export default getMedicineList;
