import express from "express";
import cors from "cors";
import getMedicineList from "./apis/getMedicineList.js";
import insertMedicineBillDetail from "./apis/insertMedicineBillDetail.js";
import insertBillDetails from "./apis/insertBillDetails.js";
import insertNewMedicineStock from "./apis/insertNewMedicineStock.js";
import getTodayTotalSales from "./apis/getTotalSales.js";
import updateMedicines from "./apis/updatemedicines.js";
import loginAuth from "./apis/loginAuth.js";
import logoutAuth from "./apis/logoutAuth.js";
import addNewUser from "./apis/addNewUser.js";
import getLoginHistory from "./apis/getLoginHistory.js";
import getRole from "./apis/getRole.js";

const app = express();
app.use(express.json());
app.use(cors());

const port = 8081;

app.get("/getMedicineList", getMedicineList);
app.post("/insertMedicineBillDetail", insertMedicineBillDetail);
app.post("/insertBillDetails", insertBillDetails);
app.post("/insertNewMedicineStock", insertNewMedicineStock);
app.get("/getTodayTotalSales", getTodayTotalSales);
app.post("/updateMedicines", updateMedicines);
app.post("/loginAuth", loginAuth);
app.post("/logoutAuth", logoutAuth);
app.post("/addNewUser", addNewUser);
app.get("/getLoginHistory", getLoginHistory);
app.get("/getRole", getRole);

app.listen(port, () => {
  console.log("server started...");
});
