export type Pet = {
  id: string;
  name: string;
  age: number;
  location: string;
  emoji?: string;
  assigned?: boolean;
  status: 'Fostering' | 'Adopted' | 'Transferred';
  species?: string;
  dob?: string | Date; // Date of birth, optional for pets without a known DOB
};

export type PetsViewListProps = {
  Pet: Pet;
  Mode: 'user' | 'admin';
  PressablePath: string;
};

export type User = {
  user_id: string;
  email: string;
  fname: string;
  lname: string;
  role: 'admin' | 'foster';
  active: boolean;
  approved_by: string | null;
  approved: boolean;
};

export type UsersViewListProps = {
  User: User;
  PressablePath: string;
};