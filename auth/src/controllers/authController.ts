import { Request, Response } from "express";
import { Joi } from "express-validation";
import { UserModel } from "../models/UserModel";
import bcryptjs from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

const registerValidation = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  passwordConfirm: Joi.string().required(),
});

export const register = async (req: Request, res: Response) => {
  const body = req.body;

  const { error } = registerValidation.validate(body);

  if (error) {
    return res.status(400).send(error.message);
  }

  if (body.password !== body.passwordConfirm) {
    return res.status(400).send("password don not match");
  }
  const { firstName, lastName, email, password } = body;

  const salt = await bcryptjs.genSalt(10);

  const hashedPassword = await bcryptjs.hash(password, salt);

  const user = new UserModel({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
  });

  let result = await user.save();

  let { password: userPassword, ...data } = result.toJSON();

  // const { password, ...data } = await result;

  console.log(error);

  res.send(data);
};

export const login = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).send({
      message: "Invalid credential",
    });
  }

  if (!(await bcryptjs.compare(req.body.password, user.password))) {
    return res.status(404).send({
      message: "Invalid credential",
    });
  }

  const token = sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET!
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.send({
    message: "success",
  });
};

export const user = async (req: Request, res: Response) => {
  try {
    const cookie = req.cookies["jwt"];

    const payload: any = verify(cookie, process.env.JWT_SECRET!);

    if (!payload) {
      return res.status(401).send({
        message: "unautenticated",
      });
    }

    const user = await UserModel.findOne({ _id: payload._id });

    if (!user) {
      return res.status(401).send({
        message: "unautenticated",
      });
    }

    const { password, ...data } = user.toJSON();

    res.send(data);
  } catch (error) {
    res.status(401).send({
      message: "unautenticated",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    maxAge: 0,
  });

  res.send({
    message: "success",
  });
};
