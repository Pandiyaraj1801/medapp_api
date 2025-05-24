import mysql from "mysql";

async function dbConnectionFunc() {
  console.log("dbConnectionFunc (+)");
  return await new Promise((resolve, reject) => {
    const dbconfig = {
      host: "127.0.0.1",
      user: "root",
      password: "root",
      database: "dev",
    };

    const dbconnect = mysql.createConnection(dbconfig);

    dbconnect.connect((err) => {
      if (err) {
        reject(`DbConnect Error Occur: ${err}`);
      }
      resolve(dbconnect);
    });

    console.log("dbConnectionFunc (-)");
  });
}

export default dbConnectionFunc;
