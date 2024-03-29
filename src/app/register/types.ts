export enum Role {
  USER = 'USER',
  ORGANISATION = 'ORGANISATION',
}

export enum Type {
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  LIFEGUARD = 'LIFEGUARD',
}

export type RegisterUserData = {
  email: string;
  password: string;
  role: Role;
  city: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  type?: Type;
  name?: string;
  street?: string;
  oib?: string;
};
