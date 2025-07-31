export type Pet = {
  pet_id: string;
  collar_id: string;
  name: string;
  location?: string;
  emoji: string;
  assigned?: boolean;
  status: 'fostering' | 'adopted' | 'available';
  species?: string;
  dob?: string | Date; // Date of birth, optional for pets without a known DOB
  breed?: string;
  gender?: string;
  created_at?: string | Date; // Creation date, optional
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