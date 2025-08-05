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

export type PetActivity = {
  id: string;
  pet_id: string;
  event_time: Date;
  category_1: number
  category_1_name?: string;
  category_1_emoji?: string;
  category_2: string;
  category_2_name?: string;
  category_2_emoji?: string;
  comment: string;
  image_url?: string | null;
};