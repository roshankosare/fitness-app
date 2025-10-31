import { compare, hash } from "bcrypt";
import { prisma } from "../util/db";
import { User } from "@prisma/client";

import {
  InternalServerError,
  InvalidAdminSecrete,
  InvalidEmailNameOrPasswordError,
  UserAlreadyExistsError,
} from "../errors";

type SignInUserProps = {
  email: string;
  password: string;
};

type SignUpUserProps = {
  email: string;
  password: string;
  fullName: string;
};
type SignUpAdminProps = {
  email: string;
  password: string;
  fullName: string;
  secret: string;
};
export const signInService = async (props: SignInUserProps) => {
  const { email, password } = props;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) throw new InvalidEmailNameOrPasswordError();

  if (!(await compare(password, user.password)))
    throw new InvalidEmailNameOrPasswordError();

  return { email: user.email, id: user.id, role: user.role } as Pick<
    User,
    "email" | "id" | "role"
  >;
};

export const signUpService = async (props: SignUpUserProps) => {
  const { email, password, fullName } = props;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) throw new UserAlreadyExistsError();

  const hashedPassword = await hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      fullName: fullName,
      password: hashedPassword,
      email: email,
      role: "USER",
      userProfile: {
        create: {},
      },
    },
  });

  if (!newUser) throw new InternalServerError();

  return { email: newUser.email, id: newUser.id, role: newUser.role } as Pick<
    User,
    "email" | "id" | "role"
  >;
};

export const signUpAdminService = async (props: SignUpAdminProps) => {
  const { email, password, fullName, secret } = props;

  if (secret !== process.env.ADMIN_SECRETE) throw new InvalidAdminSecrete();

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) throw new UserAlreadyExistsError();

  const hashedPassword = await hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      fullName: fullName,
      password: hashedPassword,
      email: email,
      role: "ADMIN",
      userProfile: {
        create: {},
      },
    },
  });

  if (!newUser) throw new InternalServerError();

  return newUser as Pick<User, "email" | "id" | "role">;
};
