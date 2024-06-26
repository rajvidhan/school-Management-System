import connection from "../utils/dbConnection.js";

import bcrypt from "bcrypt";

// import PDFDocument from "pdfkit"; //for pdf exporr
import puppeteer from "puppeteer";
import pdfTemplate from "../documents/index.js";
import pdfTemplate2 from "../documents/pdfTemplate2.js";

import XLSX from "xlsx"; // For Excel export
import stripeLib from "stripe";
// Set up Stripe
const stripe = new stripeLib(
  `sk_test_51Ow99DSJsV29GjKs8pNroJjD0lwwoEKXqRk9KfCht4ch5k4rsmv30oFqRQVDOGPCVp4zgxTcHU3yiODPJmMgBkr900KhrvXKM3`
);

export const addworkerCategory = (req, res) => {
  const name = req.params.name;
  console.log(name);
  const sql = `INSERT INTO workercategory 
    (name) VALUES (?)`;

  connection.query(sql, [name], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({
        message: "failed",
        success: false,
      });
    } else {
      console.log(result);
      return res.json({
        message: "success",
        success: true,
      });
    }
  });
};

export const getworkercategory = (req, res) => {
  const sql = `SELECT * FROM workercategory`;

  connection.query(sql, null, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return res.json({
        message: "success",
        data: result,
        success: true,
      });
    }
  });
};

export const EmployAdd = (req, res) => {
  const sql = `INSERT INTO employee 
    (name,email,password,salary,hiringdate,yearexpreience,Higherqualification,position,gender,address,image) 
    VALUES (?)`;

  bcrypt.hash(req.body.password.toString(), 10, (err, hashpassword) => {
    if (err) {
      return res.json({
        message: "Query Error",
        success: false,
      });
    }

    const values = [
      req.body.name,
      req.body.email,
      hashpassword,
      req.body.salary,
      req.body.joindate,
      req.body.experience,
      req.body.higherQualification,
      req.body.position,
      req.body.gender,
      req.body.address,
      req.body.image,
    ];
    console.log(values);
    connection.query(sql, [values], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: err,
        });
      } else {
        return res.json({
          success: true,
          message: "Eployee Add successfully",
        });
      }
    });
  });
};

export const AddStudent = async (req, res) => {
  const Values = [
    req.body.name,
    req.body.Mothername,
    req.body.admissiondate,
    req.body.previousschool,
    req.body.Fathername,
    req.body.fcontact,
    req.body.mcontact,
    req.body.email,
    req.body.class,
    req.body.lastClassScore,
    req.body.address,
    req.body.image,
  ];
  const sql1 = `SELECT totalStudents from classes where name = ?`;
  connection.query(sql1, [req.body.class], (err, result1) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result1[0].totalStudents);

      const sql2 = `UPDATE classes
  SET totalStudents = ?
  WHERE name = ?;
  `;
      connection.query(
        sql2,
        [result1[0].totalStudents + 1, req.body.class],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
            const sql3 = `INSERT INTO students 
    (name,MotherName,admissiondate,previousschool,FatherName,FatherContact,MotherContact,email,class,PrevScore,address,image)
    VALUES (?)`;
            connection.query(sql3, [Values], (err, result) => {
              if (err) {
                console.log(err);
                return res.json({
                  message: "failed",
                  success: false,
                });
              } else {
                return res.json({
                  message: "true",
                  success: true,
                });
              }
            });
          }
        }
      );
    }
  });
};

export const attendsheetstudent = async (req, res) => {
  const classname = req.params.class;
  const date = req.params.date;

  const sql = `SELECT students.name,students.image,atendancestudent.attendance,atendancestudent.date
    FROM students
    INNER JOIN atendancestudent ON students.name = atendancestudent.studentname
    WHERE atendancestudent.date=? AND students.class=?`;

  connection.query(sql, [date, classname], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      return res.json({
        data: result,
        success: true,
      });
    }
  });
};

export const download = (req, res) => {
  const classname = req.params.class;
  const date = req.params.date;
  const sql = `SELECT students.name,students.image,atendancestudent.attendance,atendancestudent.date
    FROM students
    INNER JOIN atendancestudent ON students.name = atendancestudent.studentname
    WHERE atendancestudent.date=? AND students.class=?`;
  connection.query(sql, [date, classname], (err, result) => {
    if (err) {
      return res.jaon({
        message: "failed",
      });
    }
    console.log(result);

    // Convert data to desired format (e.g., Excel)
    const workbook = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(result);
    XLSX.utils.book_append_sheet(workbook, ws, "Sheet1");

    // Send file to client
    XLSX.writeFile(workbook, "attendanceSheet.xlsx");
    console.log(workbook);
    res.download("attendanceSheet.xlsx");
  });
};

export const AddPresent = async (req, res) => {
  const studentId = req.params.studentid;
  const classname = req.params.className;
  const presentvalue = req.params.presentValue;
  const date = req.params.date;
  const sql = `INSERT INTO atendancestudent
  (studentname,class,attendance,date	)
  VALUES (?)`;

  const Values = [studentId, classname, presentvalue, date];

  connection.query(sql, [Values], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({
        message: "failed",
        success: false,
      });
    } else {
      console.log(result);
      return res.json({
        success: true,
        message: "success",
      });
    }
  });
};

export const AddpresentEm = async (req, res) => {
  const name = req.params.name;
  const position = req.params.position;
  const status = req.params.present;
  const formattedDate = req.params.formattedDate;
  const month = req.params.month;
  const year = req.params.year;
  const sql = `INSERT INTO attendanceemployee
    (name,status,position,date,month,year)
    VALUES (?)`;
  const values = [name, status, position, formattedDate, month, year];
  connection.query(sql, [values], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return res.json({
        success: true,
      });
    }
  });
};

export const attendsheetEm = (req, res) => {
  const name = req.params.name;
  const position = req.params.position;
  const month = req.params.month;
  const year = req.params.year;

  const sql = `SELECT employee.name,employee.gender,employee.email,attendanceemployee.status,attendanceemployee.date,attendanceemployee.month
FROM employee 
INNER JOIN attendanceemployee ON employee.name = attendanceemployee.name
WHERE attendanceemployee.month=? AND attendanceemployee.year=? AND employee.name =? AND employee.position=?`;

  connection.query(sql, [month, year, name, position], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return res.json({
        message: "success",
        success: true,
        data: result,
      });
    }
  });
};

export const getEmployee = async (req, res) => {
  const id = req.params.name;

  const sql = "SELECT * FROM employee WHERE name=?";

  connection.query(sql, [id], (err, result) => {
    if (err) {
      return res.json({
        success: false,
        message: "Query Error",
      });
    } else {
      return res.json({
        data: result,
        success: true,
        message: "Employee fetch successfully",
      });
    }
  });
};

export const EmPresentinMonth = async (req, res) => {
  const month = req.params.month;
  const year = req.params.year;
  const name = req.params.name;
  const salary = req.params.salary;

  const sql = `SELECT COUNT(id) as presentdays FROM attendanceemployee 
    WHERE status =? AND name=? AND month = ? AND year=?`;
  connection.query(sql, ["present", name, month, year], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const countofpresent = result[0].presentdays;
      const perdaysalary = salary / 30;
      const overallperday = Math.floor(perdaysalary);
      const totalpayment = overallperday * countofpresent;

      return res.json({
        message: "success",
        success: true,
        data: totalpayment,
        totalpreset: countofpresent,
      });
    }
  });
};

export const Payments = async (req, res) => {
  const customer = await stripe.customers.create({
    email: "vidhangour20@gmail.com",
    name: "hari",
    address: {
      line1: "Rajasthan",
      city: "Jaipur",
      postal_code: "303348",
      country: "US", // ISO 3166-1 alpha-2 country code
    },
  });
  const payment  = req.body.payment;

  const lineItems = [
    {
      price_data: {
        currency: "inr",
        product_data: {
          name: "Money",
        },
        unit_amount: payment * 100,
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancle",
    billing_address_collection: "auto", // Require billing address from customer
    customer: customer.id, // Pass the customer name directly
  });

  return res.json({ success:true,id: session.id });
};

export const insetPayDetails = async (req, res) => {
  const sql = `INSERT INTO salarydetails 
(salaryholder,salarygivenby,date,month,year,howmuch,salary,present,paymentstatus,salaryholderemail)
VALUES (?)`;

  const values = [
    req.body.salaryholder,
    req.body.salarygivenby,
    req.body.date,
    req.body.month,
    req.body.year,
    req.body.howmuch,
    req.body.salary,
    req.body.present,
    req.body.paymentstatus,
    req.body.salaryholderemail,
  ];

  connection.query(sql, [values], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return res.json({
        message: "success",
        success: true,
        data: result,
      });
    }
  });
};

export const StudentFeeDetails = async (req,res)=>{
 const values = [
  req.body.name,
  req.body.howmuch,
  req.body.class,
  req.body.fixfee,
  req.body.year,
  req.body.date,
  req.body.status
 ]
 
 const sql = `INSERT INTO studentfee
 (name,howmuch,class,fixfee,year,date,status)
 VALUES (?)`

 connection.query(sql,[values],(err,result)=>{
  if(err){
    console.log(err)
  }else{
    return res.json({
      data:result,
      success:true,
      message:"success"
    })
  }
 })
}

export const checkfeeSubmit = async (req,res)=>{

   const name =  req.body.name;
    const year = req.body.year;
    const Class = req.body.class

 const sql = `select * from studentfee
 where name = ? and year = ? and class = ?`;
 connection.query(sql,[name,year,Class],((err,result)=>{
  if(err){
    console.log(err);
    return res.json({
      success:false
    })
  }else{
    return res.json({
      success:true,
      message:"success",
      data:result
    })
  }
 }))
}
export const FeesubData = async (req,res)=>{

 
   const year = req.body.year;
   const Class = req.body.class

const sql = `select * from studentfee
where year = ? and class = ?`;
connection.query(sql,[year,Class],((err,result)=>{
 if(err){
   console.log(err);
   return res.json({
     success:false
   })
 }else{
   return res.json({
     success:true,
     message:"success",
     data:result
   })
 }
}))
}

export const FeeNosubData = async (req,res)=>{

 
  const year = req.body.year;
  const Class = req.body.class

const sql = `select students.name,students.email,students.FatherContact,students.class,classes.fee
from students
left join studentfee
on students.name = studentfee.name
join classes on students.class = classes.name
where studentfee.name  is null and students.class = ? and students.admissiondate between "${year}-01-01" and "${year}-12-31";`;
connection.query(sql,[Class],((err,result)=>{
if(err){
  console.log(err);
  return res.json({
    success:false
  })
}else{
 
  return res.json({
    success:true,
    message:"success",
    data:result
  })
}
}))
}




export const paymentDetails = async (req, res) => {
  const year = req.params.paymentdetailYear;

  const sql = `SELECT * FROM salarydetails WHERE year = ? order by month asc`;

  connection.query(sql, [year], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return res.json({
        data: result,
        message: "success",
        success: true,
      });
    }
  });
};
export const patmentDetailsforem = async (req, res) => {
  const year = req.params.year;
  const name = req.params.name;
  console.log(year, name);
  const sql = `SELECT * FROM salarydetails WHERE year = ? AND salaryholder = ?`;

  connection.query(sql, [year, name], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return res.json({
        data: result,
        message: "success",
        success: true,
      });
    }
  });
};

export const emdetails = async (req, res) => {
  const sql = ` SELECT * FROM employee WHERE email = ?`;
  const email = req.params.email;
  connection.query(sql, [email], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return res.json({
        data: result,
        message: "Successfully fetched",
        success: true,
      });
    }
  });
};

export const postnotification = async (req, res) => {
  const sql = `insert into urgentnotifications
 (email,description,subject,forwho)
 values (?)`;

  const values = [req.body.email, req.body.des, req.body.sub, req.body.for];

  connection.query(sql, [values], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({
        message: "fail",
      });
    } else {
      return res.json({
        message: "success",
        success: true,
      });
    }
  });
};

export const allnotifications = async (req, res) => {
  const sql = `select * from urgentnotifications`;

  connection.query(sql, null, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return res.json({
        data: result,
        message: "success",
        success: true,
      });
    }
  });
};

export const deleteNoti = async (req, res) => {
  const sql = `delete from urgentnotifications where description =?`;

  connection.query(sql, [req.params.data], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return res.json({
        message: "success",
        success: true,
      });
    }
  });
};
export const notificationsfor = async (req, res) => {
  const role = req.params.role;

  const sql = `select * from urgentnotifications where forwho = ? or forwho = "both"`;
  connection.query(sql, [role], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return res.json({
        data: result,
        message: "success",
        success: true,
      });
    }
  });
};

export const pdfdownload = async (req, res) => {
  const pdfContent = req.body; // PDF content to be generated


  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(pdfTemplate(pdfContent)); // Set content for PDF
    const pdfBuffer = await page.pdf(); // Generate PDF as buffer
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="generated-pdf.pdf"',
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
};

export const reciptDowload = async (req,res)=>{
  const pdfContent = req.body; // PDF content to be generated

console.log(pdfContent)
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(pdfTemplate2(pdfContent)); // Set content for PDF
    const pdfBuffer = await page.pdf(); // Generate PDF as buffer
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="generated-pdf.pdf"',
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
}

export const getsalaryDetails = async (req, res) => {
  const sql = `SELECT * FROM salarydetails ORDER BY salaryholder ASC`;

  connection.query(sql, null, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return res.json({
        data: result,
        msg: "successfully fetch",
        success: true,
      });
    }
  });
};

export const studentDataforfee = async (req,res)=>{


const year = req.params.year;
const emailid = req.params.email;
const date1 = `${year}-01-01`;
const date2 = `${year}-12-31`;

const sql = `select s.name,s.class,s.image,c.fee
from students s
join classes c on s.class = c.name
where s.email = ? and s.admissiondate between ? and ?`




connection.query(sql,[emailid,date1,date2],(err,result)=>{
  if(err){
    console.log(err)
  }else{
   return res.json({
    data:result,
    message:"Successfull",
    success:true
   })
  }
})



}