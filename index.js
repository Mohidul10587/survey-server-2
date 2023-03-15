const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
app.use(cors())
// create mysql connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'splbdnet_sql',
  password: 'asdfghjkl',
  database: 'splbdnet_sql'
});

// connect to database
conn.connect((err) => {
  if (err) throw err;
  console.log('Connected to database!');
});

// configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// create a new record
app.post('/api/records', (req, res) => {
  const data = req.body;

  const query = 'INSERT INTO records (nameOfKhanaHead, NID, holdingNo, wordNo, unio, thana, district, mobileNumber, boyChildDescription, girlChildDescription, expatriateDescription, divorcedDescription, disabledDescription, governmentsJobHolders, professionOfKhanaHead,incomeOfKhanaHead,quantityOfInfield,uncultivatedLand,employeeDescription,UnemployedDescription, freedomFData,oldPersonsData,nameOfHusbandOfKhanaHead,ageOfHusbandOfKhanaHead,professionOfHusbandOfKhanaHead,nameOfReporter,idOfHusbandOfKhanaHead, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  const values = [data.nameOfKhanaHead, data.NID, data.holdingNo, data.wordNo, data.unio, data.thana, data.district, data.mobileNumber, JSON.stringify(data.boyChildDescription), JSON.stringify(data.girlChildDescription),
  JSON.stringify(data.expatriateDescription), JSON.stringify(data.divorcedDescription), JSON.stringify(data.disabledDescription), JSON.stringify(data.governmentsJobHolders), data.professionOfKhanaHead, data.incomeOfKhanaHead,
  data.quantityOfInfield, data.uncultivatedLand, JSON.stringify(data.employeeDescription), JSON.stringify(data.UnemployedDescription), JSON.stringify(data.freedomFData), JSON.stringify(data.oldPersonsData), data.nameOfHusbandOfKhanaHead, data.ageOfHusbandOfKhanaHead, data.professionOfHusbandOfKhanaHead, data.nameOfReporter, data.idOfHusbandOfKhanaHead, data.remarks];

  conn.query(query, values, (err, result) => {
    if (err) throw err;
    console.log('Inserted data into MySQL database');
    res.send({ data: 'Data inserted successfully' });
  });
});




// create a new user
app.post('/api/records/users', (req, res) => {
  const data = req.body;
  const query = 'INSERT INTO users (name, email, roll) VALUES (?, ?, ?)';
  const values = [data.name, data.email, data.roll];

  conn.query(query, values, (err, result) => {
    if (err) throw err;
    console.log('Inserted data into MySQL database');
    res.send({ data: 'Data inserted successfully' });
  });


});


// get all users
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM users';

  conn.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});



// Define a route for updating the 'roll' column for a user
app.put('/admin/:email', function (req, res) {
  const email = req.params.email;
  const newRoll = 'employee';

  // Update the 'roll' column for the specified user
  const sql = `UPDATE users SET roll = '${newRoll}' WHERE email = '${email}'`;
  conn.query(sql, function (err, result) {
    if (err) throw err;
    console.log(`Updated roll for user with email ${email} to ${newRoll}`);
    res.send({ massage: 'Update Success' });
  });
});


// check user is employee or not
app.get('/employee/:email', async (req, res) => {

  const email = req.params.email;

  const sql = 'SELECT * FROM users WHERE email = ?'
  conn.query(sql, email, (err, result) => {
    if (err) throw err;
     const isEmployee = result[0].roll== 'employee';
    res.send({employee:isEmployee});
  });


})

// check user is employee or not
app.get('/superAdmin/:email', async (req, res) => {

  const emailS = req.params.email;

  const sql = 'SELECT * FROM users WHERE email = ?'
  conn.query(sql, emailS, (err, results) => {
    if (err) throw err;
     const isSuperAdmin = results[0].roll== 'super_admin';
     console.log(isSuperAdmin)
    res.send({super_admin:isSuperAdmin});
  });

})







// delete a user
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM users WHERE id = ?';

  conn.query(sql, id, (err, results) => {
    if (err) throw err;
    res.json({ message: 'Record deleted successfully' });
  });
});




// get all records
app.get('/api/records', (req, res) => {
  const sql = 'SELECT * FROM records';

  conn.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// get a single record
app.get('/api/records/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM records WHERE id = ?';

  conn.query(sql, id, (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

// update a record 
app.put('/api/records/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const sql = 'UPDATE records SET ? WHERE id = ?';

  conn.query(sql, [data, id], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Record updated successfully' });
  });
});

// delete a record
app.delete('/api/records/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM records WHERE id = ?';

  conn.query(sql, id, (err, results) => {
    if (err) throw err;
    res.json({ message: 'Record deleted successfully' });
  });
});


// For District
app.get('/search/:subject/:district', async (req, res) => {
  const subject = req.params.subject;

  const education = req.headers.education;
  const sql = `SELECT * FROM records WHERE district = ?`;
  const district = req.params.district.trim();

  conn.query(sql, [district], async (err, results) => {
    if (err) throw err;

    function extractValue(arr, prop) {
      let extractedValue = arr.map(item => item[prop]);
      return extractedValue;
    }

    const result = await extractValue(results, subject);
    let newArr = []
    let finalResult;
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      let value = JSON.parse(element)
      newArr.push(...value)
    }

    if (education !== 'undefined') {

      const finalArray = newArr.filter(obj => obj.firstUnemployedEducation == education);
      finalResult = finalArray;
    } else {

      finalResult = newArr;
    }
    res.json(finalResult);
  });
})



// For Thana
app.get('/search2/:subject/:thana', async (req, res) => {
  const subject = req.params.subject;
  const education = req.headers.education;
  const sql = `SELECT * FROM records WHERE thana = ?`;
  const thana = req.params.thana.trim();
  conn.query(sql, [thana], async (err, results) => {

    if (err) throw err;
    function extractValue(arr, prop) {
      let extractedValue = arr.map(item => item[prop]);
      return extractedValue;
    }
    const result = await extractValue(results, subject);


    let newArr = []
    let finalResult;

    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      let value = JSON.parse(element)
      newArr.push(...value)

    }
    if (education !== 'undefined') {
      const finalArray = newArr.filter(obj => obj.firstUnemployedEducation == education);
      finalResult = finalArray;
    } else {
      finalResult = newArr;
    }
    res.json(finalResult);
  });
})





// for Exp in a district
app.get('/searchExpInDistrict/:countryName/:districtForExp', async (req, res) => {

  const countryOfExpOfDistrict = req.params.countryName.trim();
  const districtForExp = req.params.districtForExp.trim();

  const sql = `SELECT * FROM records WHERE district = ?`;
  conn.query(sql, [districtForExp], async (err, results) => {

    if (err) throw err;

    let exArray = []
    for (let i = 0; i < results.length; i++) {
      const element = results[i];
      let value = JSON.parse(element.expatriateDescription)
      exArray.push(...value)

    }
    const finalArray = exArray.filter(obj => obj.firstExpatriateCountry == countryOfExpOfDistrict);

    res.send(finalArray)

  }

  );

})


// for Exp in a thana
app.get('/searchExpInThana/:countryName/:thanaForExp', async (req, res) => {

  const countryName = req.params.countryName;
  const thanaForExp = req.params.thanaForExp.trim();
  console.log(countryName, thanaForExp)
  const sql = `SELECT * FROM records WHERE thana = ?`;
  conn.query(sql, [thanaForExp], async (err, results) => {

    if (err) throw err;

    let exArray = []
    for (let i = 0; i < results.length; i++) {
      const element = results[i];
      let value = JSON.parse(element.expatriateDescription)
      exArray.push(...value)

    }
    const finalArray = exArray.filter(obj => obj.firstExpatriateCountry == countryName);
    console.log(finalArray)
    res.send(finalArray)

  }

  );

})


app.get('/',(req,res)=>{
res.send({data:'test'})
})

// start the server
app.listen(PORT);














