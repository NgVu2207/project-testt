let { PrismaClient, Prisma } = require("@prisma/client");
const { failCode, errorCode, successCode } = require("../ultis/reponse");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { encodeToken } = require("../middlewares/auth");


//C: Create
const createUser = async (req, res) => {
  try {
    let { full_name, email, pass_word } = req.body;
    let data = { full_name, email, pass_word };

    let result = await prisma.user.create({ data });
    successCode(res, result, "Thêm dữ liệu thành công");
  } catch (error) {
    errorCode(res, "Lỗi back end");
  }
};

//R: Read
const getUser = async (req, res) => {
  let data = await prisma.user.findMany();
  successCode(res, data, "lấy dữ liệu thành công");
};

//R: Read : id
const getUserId = async (req, res) => {
  let { id } = req.params;
  let data = await prisma.user.findFirst({
    where: {
      user_id: Number(id),
    },
  });
  successCode(res, data, "lấy dữ liệu thành công");
};

//R: search like '%%'
const searchByName = async (req, res) => {
  let { hoTen } = req.params;
  let result = await prisma.user.findMany({
    where: {
      full_name: {
        contains: hoTen,
      },
    },
  });
  successCode(res, result, "lấy dữ liệu thành công");
};

//U: Update
const updateUser = async (req, res) => {
  try {
    let { id } = req.params;
    let { full_name, email, pass_word } = req.body;
    let data = { full_name, email, pass_word };

    let result = await prisma.user.update({
      data,
      where: { user_id: Number(id) },
    });
    successCode(res, result, "Cập nhật thành công");
  } catch (error) {
    failCode(res, "", "user không tồn tại");
  }
};

//D: Delete
const deleteUser = async (req, res) => {
  let { id } = req.params;
  let result = await prisma.user.delete({ where: { user_id: Number(id) } });
  successCode(res, result, "Xóa thành công");
};

// signUp
const signUp = async (req, res) => {
  try {
    const { full_name, email, pass_word } = req.body;
    let data = {
      full_name,
      email,
      pass_word: bcrypt.hashSync(pass_word, 10),
    };
    const checkUser = await prisma.user.findFirst({ where: { email } });
    if (checkUser) {
      failCode(res, "", "email đã tồn tại");
    } else {
      await prisma.user.create({ data });
      successCode(res, data, "Đăng ký thành công");
    }
  } catch (error) {
    errorCode(res, "Đăng ký thất bại");
  }
  // kiểm tra email
};

// login
const login = async (req, res) => {
  try {
    let { email, pass_word } = req.body;

    const checkUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (checkUser) {
      // kiểm tra mã hóa pass word
      let checkPass = bcrypt.compareSync(pass_word, checkUser.pass_word);

      if (checkPass) {
        let token = encodeToken(checkUser);
        successCode(res, token, "Đăng nhập thành công !");
      } else {
        failCode(res, "", "Mật khẩu không đúng!");
      }
    } else {
      failCode(res, "", "Email không đúng!");
    }
  } catch (err) {
    errorCode(res, "Đăng nhập thất bại");
  }
};

module.exports = {
  getUser,
  getUserId,
  searchByName,
  createUser,
  updateUser,
  deleteUser,
  signUp,
  login,
};
