export type User = {
  id: string;
  email: string;
  name: string;
  password: string;
  image: string | null;
  dateOfBirth: Date;
  phoneNumber: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};
