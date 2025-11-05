import jwt from "jsonwebtoken";

const genToken = async (userId: string) => {
  try {
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET as string,
      { expiresIn: "10d" }
    );
    return token;
  } catch (error) {
    console.log(error);
  }
};

export default genToken;