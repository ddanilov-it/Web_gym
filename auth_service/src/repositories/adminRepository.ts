import Admin from "../entities/admin";

export const createAdmin = async (
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  email: string
): Promise<number> => {
  const admin = await Admin.create({ username, password, firstName, lastName, email });
  return admin.id;
};

export const getAdminByEmail = async (email: string): Promise<Admin | null> => {
  return await Admin.findOne({ where: { email } });
};

export const getAllAdmins = async (): Promise<Admin[]> => {
  return await Admin.findAll();
};
