const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("./config/database");
const app = express();
const port = 3000;

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/daftar", async (req, res) => {
  const { fullname, email, password, umur, role } = req.body;
  try {
    const post_data =
      await db.query(`INSERT INTO user(fullname, email, password, umur, role) VALUES ("${fullname}", "${email}", "${password}", "${umur}", "${role}")`);

    if (post_data) {
      const logInsert = await db.query(
        `INSERT INTO logs(pesan, waktu) VALUES ("User baru terdaftar dengan ID ${post_data.insertId
        }", "${new Date().toISOString().slice(0, 19).replace("T", " ")}")`,
      );
    }

    res.status(200).json({
      msg: "Berhasil membuat user",
      user: post_data,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Gagal membuat user",
      err: error,
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const User = await db.query(
    `SELECT id, fullname, profile_picture, umur, role FROM user WHERE email = '${email}' AND password = '${password}' `,
  );

  if (User.length === 1) {
    const login_log = await db.query(
      `INSERT INTO logs(pesan, waktu) VALUES ("User dengan ID ${User[0].id
      } telah login", "${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}")`,
    );

    const token = jwt.sign(User[0], process.env.JWT_SECRET_KEY, {
      expiresIn: "3600s",
    });

    return res.json({
      msg: "Logged In",
      data: token,
    });
  }

  return res.status(401).json({
    msg: "User not Found",
  });
});

app.post("/verifytoken", (req, res) => {
  const { token } = req.body;

  if (token) {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

    return res.json({
      data: data,
    });
  }

  return res.json({
    msg: "Token invalid",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
