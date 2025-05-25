import mysql from "mysql2";
import fs from "fs";
import toml from "@iarna/toml";

const configData = toml.parse(fs.readFileSync("toml/dbconfig.toml", "utf-8"));

async function dbConnectionFunc() {
  console.log("dbConnectionFunc (+)");

  return await new Promise((resolve, reject) => {
    const dbconfig = {
      host: configData.db_host,
      user: configData.db_user,
      password: configData.db_pass,
      database: configData.db_name,
      port: configData.db_port,
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
