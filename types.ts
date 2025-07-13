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