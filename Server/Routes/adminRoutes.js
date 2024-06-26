import express from "express"
import { AddPresent, AddStudent, AddpresentEm, EmPresentinMonth, EmployAdd, FeeNosubData, FeesubData, Payments, StudentFeeDetails, addworkerCategory, allnotifications, attendsheetEm, attendsheetstudent, checkfeeSubmit, deleteNoti, download, emdetails, getEmployee, getsalaryDetails, getworkercategory, insetPayDetails, notificationsfor, patmentDetailsforem, paymentDetails, pdfdownload, postnotification, reciptDowload, studentDataforfee } from "../controllers/admin-Controller.js";

const router = express.Router();

router.post("/addworkcategory/:name",addworkerCategory);
router.get("/getworkercategory",getworkercategory)
router.post("/add-employ",EmployAdd);


// student
router.post("/add-student",AddStudent);
router.get("/attendancesheet/:class/:date",attendsheetstudent);
router.get("/attendancesheetEm/:name/:position/:month/:year",attendsheetEm);
router.get("/export-data/:class/:date",download);
router.get("/employee/:name",getEmployee);
router.get("/EmPresentinMonth/:month/:year/:name/:salary",EmPresentinMonth)
router.post("/addpresent/:className/:studentid/:presentValue/:date",AddPresent)
router.post("/addpresentEm/:name/:position/:present/:formattedDate/:month/:year",AddpresentEm);

// for payments 
router.post("/createpayment",Payments);
router.post("/insertpay",insetPayDetails);
router.post("/insertfeedetails",StudentFeeDetails)

router.post("/chefeeSubmit",checkfeeSubmit)
router.post("/FeesubData",FeesubData);
router.post("/feetnotsub",FeeNosubData)
router.get("/getpaydetail/:paymentdetailYear",paymentDetails);
router.get('/emdetails/:email',emdetails);
router.get("/paydetailsem/:year/:name",patmentDetailsforem);
router.post("/postnotification",postnotification);
router.get('/notifications',allnotifications);
router.delete("/deletenotification/:data",deleteNoti)
router.get("/notificationsfor/:role",notificationsfor)

// pdf download 
router.post("/pdfdownload",pdfdownload)
router.post("/reciptDowload",reciptDowload);


router.get("/salarydetails",getsalaryDetails)
router.get("/feestudentdata/:year/:email",studentDataforfee)
export {router as adminRouter};