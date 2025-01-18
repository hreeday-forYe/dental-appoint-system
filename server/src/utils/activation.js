import jwt from "jsonwebtoken";
const createActivationToken = (userdata) => {
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const token = jwt.sign(
    {
      userdata,
      activationCode,
    },
    process.env.ACTIVATION_SECRET,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

export default createActivationToken;
