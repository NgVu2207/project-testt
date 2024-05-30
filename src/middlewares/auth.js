const jwt = require("jsonwebtoken");

// mã hóa dữ liệu thành token
const encodeToken = (data) => {
  let token = jwt.sign({ data }, "BAOMAT", { expiresIn: "120s" });

  console.log(token);
  return token;
};
// kiểm tra token có hợp lệ hay không
const checkToken = (token) => {
  const verifyToken = jwt.verify(token, "BAOMAT");

  if (verifyToken) {
    return true;
  } else return false;
};

// giải mã token
const decode = (token) => {
  return jwt.decode(token);
};

// kiểm tra token
const kiemTraToken = (req, res, next) => {
  try {
    let { auth } = req.headers;

    if (checkToken(auth)) {
      next();
    }
  } catch {
    res.status(401).send("Token không hợp lệ !");
  }
};

module.exports = { decode, checkToken, encodeToken, kiemTraToken };
