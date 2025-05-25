import dbConnectionFunc from "../dbconnection/dbconnection.js";

async function getTodayTotalSales(req, res) {
  console.log("getTodayTotalSales (+)");

  const todayTotalSales = {
    todayTotalPrice: 0,
    status: "",
    errMsg: "",
  };

  todayTotalSales.status = "S";

  let dbconnect;
  try {
    dbconnect = await dbConnectionFunc();

    const result = await getTodayTotalSalesQuery(dbconnect, todayTotalSales);
    if (result.status === "E") {
      todayTotalSales.status = "E";
      res.status(200).json(todayTotalSales);
    } else {
      todayTotalSales.status = "S";
      res.status(200).json(result);
    }
  } catch (err) {
    todayTotalSales.status = "E";
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

  console.log("getTodayTotalSales (-)");
}

async function getTodayTotalSalesQuery(dbconnect, todayTotalSales) {
  console.log("getTodayTotalSalesQuery (+)");

  const sqlQuery = `
select sum(netpayable) as totalAmt
from billentrydetails
where str_to_date(billdate, '%d/%m/%Y') = curdate();`;

  return await new Promise((resolve, reject) => {
    dbconnect.query(sqlQuery, (err, result) => {
      if (err) {
        todayTotalSales.status = "E";
        todayTotalSales.errMsg = err;
        reject(todayTotalSales);
      } else {
        if (result[0].totalAmt === null) {
          todayTotalSales.todayTotalPrice = 0;
        } else {
          todayTotalSales.todayTotalPrice = parseFloat(
            result[0].totalAmt
          ).toFixed(2);
        }

        todayTotalSales.status = "S";
        resolve(todayTotalSales);
      }
    });

    console.log("getTodayTotalSalesQuery (-)");
  });
}

export default getTodayTotalSales;
