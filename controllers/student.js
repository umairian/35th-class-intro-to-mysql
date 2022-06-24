const dbConnection = require("../models");

async function post(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email) {
      return res.status(400).send("Required fields can't be empty");
    }
    const db = await dbConnection();
    const result = await db.execute(`INSERT INTO students (name, email) VALUES ('Wajid', 'wajid@gmail.com')`);
    console.log(result)

    res.status(200).send("Student created successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
}

async function getAll(req, res) {
  try {
    const db = await dbConnection();
    const result = await db.execute(`SELECT * FROM students`);
    // const result = await db.execute(`SELECT * FROM students WHERE name='Owais Haseeb'`);
    res.status(200).send({ students: result[0]});
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
}

async function getSingle(req, res) {
  try {
    const { studentId } = req.params;
    const student = await Students.findById(studentId);
    res.status(200).send({ student });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
}

async function update(req, res) {
  try {
    const { name } = req.body;
    const { studentId } = req.params;

    if (!name) {
      return res.status(400).send("Name is required");
    }
    const student = await Students.updateOne(
      {
        _id: studentId,
      },
      {
        $set: {
          name: name,
        },
      }
    );
    res.status(200).send({ student });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
}

async function deleteStudent(req, res) {
  try {
    const { studentId } = req.params;
    await Students.remove({
      _id: studentId,
    });
    res.status(200).send("Student deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Required fields can't be empty");
    }

    let student = await Students.findOne({ email });
    if(!student) {
      return res.status(404).send("Email doesn't exist");
    }

    const result = await bcrypt.compare(password, student.password);
    if(!result) {
      return res.status(401).send("Password is incorrecct");
    }

    student = student.toJSON();
    delete student.password;
    const token = jwt.sign({
      student: student
    }, "first-token")

    res.status(200).send({
      token, student
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
}

module.exports = {
  post,
  getAll,
  getSingle,
  update,
  deleteStudent,
  login
};
