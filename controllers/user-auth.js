const { container } = require("../container");
const { sendSuccess, sendCreated } = require("../utils/response");

// ----------------------------- Register -------------------------------- \\
const register = async (req, res) => {
  const authService = container.getAuthService();
  const { name, email, password } = req.body;

  const result = await authService.register({ name, email, password });

<<<<<<< HEAD
  const mailSender = await sendWelcomeEmail(user.name, user.email);

  res.status(200).json({ message  : { user, token }});
=======
  return sendCreated(res, {
    message: "Registration successful",
    data: {
      user: result.user,
      token: result.token,
    },
    extra: {
      user: result.user,
      token: result.token,
    },
  });
>>>>>>> main
};

// ----------------------------- Login -------------------------------- \\
const login = async (req, res) => {
  const authService = container.getAuthService();
  const { email, password } = req.body;

  const result = await authService.login({ email, password });

<<<<<<< HEAD
  const user = await User.findByCredentails(email, password);

  const token = await user.generateToken();

  res.status(StatusCodes.OK).json({message  :{ user, token }});
=======
  return sendSuccess(res, {
    message: "Login successful",
    data: {
      user: result.user,
      token: result.token,
    },
    extra: {
      user: result.user,
      token: result.token,
    },
  });
>>>>>>> main
};

// ----------------------------- Logout (Single Device) -------------------------------- \\
const logout = async (req, res) => {
<<<<<<< HEAD
  req.user.tokens = req.user.tokens.filter(
    (token) => token.token !== req.token
  );
  await req.user.save();
  res.status(200).send({ message: "Successfully logged out" });
=======
  const authService = container.getAuthService();
  const result = await authService.logout(req.user.id, req.token);

  return sendSuccess(res, {
    message: result.message,
  });
>>>>>>> main
};

// ----------------------------- Logout All Devices -------------------------------- \\
const logoutFromAll = async (req, res) => {
<<<<<<< HEAD
  req.user.tokens = [];
  await req.user.save();
  res.status(200).send({ message: "Successfully logged out from all devices" });
=======
  const authService = container.getAuthService();
  const result = await authService.logoutFromAll(req.user.id);

  return sendSuccess(res, {
    message: result.message,
  });
>>>>>>> main
};

// ----------------------------- Profile -------------------------------- \\
const profile = async (req, res) => {
<<<<<<< HEAD
  res.status(200).json({
    message: req.user,
=======
  const authService = container.getAuthService();
  const user = await authService.getProfile(req.user.id);

  return sendSuccess(res, {
    message: "Profile retrieved successfully",
    data: { user },
    extra: { user },
>>>>>>> main
  });
};

// ----------------------------- Dashboard -------------------------------- \\
const dashboard = async (req, res) => {
<<<<<<< HEAD
  const luckyNumber = Math.round(Math.random() * 99);
  res.status(200).json({
    message: `Hello ${req.user.name}, login successfull with email address ${req.user.email}. `,
    secret: `Here is your secret number ${luckyNumber}`,
=======
  const userDTO = req.user.toDTO ? req.user.toDTO() : req.user;
  return sendSuccess(res, {
    message: `Welcome back, ${req.user.name}!`,
    data: { user: userDTO },
    extra: { user: userDTO },
>>>>>>> main
  });
};

// ----------------------------- Forget Password -------------------------------- \\
const forgetPasswordRequest = async (req, res) => {
  const authService = container.getAuthService();
  const result = await authService.requestPasswordReset(req.body.email);

<<<<<<< HEAD
  const tempPassword = randomKey.generate(10);
  const newHashedPassword = await bcrypt.hash(tempPassword, 8);

  const user = await User.findOneAndUpdate(
    { email },
    { password: newHashedPassword },
    { new: true, runValidators: true }
  );
  if (!user) throw new CustomError("User not found", 404);

  const message = await sendForgetPassword(email, tempPassword);

  res.status(200).send({ message });
=======
  return sendSuccess(res, {
    message: result.message,
  });
>>>>>>> main
};

// ----------------------------- Update Password -------------------------------- \\
const updatePasswordRequest = async (req, res) => {
  const authService = container.getAuthService();
  const { oldPassword, newPassword } = req.body;

  const result = await authService.updatePassword(req.user.id, {
    oldPassword,
    newPassword,
  });

<<<<<<< HEAD
  const checkPassworMatch = await bcrypt.compare(oldPassword, req.user.password)
  if (!checkPassworMatch) throw new CustomError("Invalid password", 400);

  req.user.password = newPassword 
  await req.user.save();
  res.status(200).send({ message: "Password changed successfully" });
=======
  return sendSuccess(res, {
    message: result.message,
  });
>>>>>>> main
};

module.exports = {
  login,
  dashboard,
  register,
  logout,
  logoutFromAll,
  profile,
  forgetPasswordRequest,
  updatePasswordRequest,
};
