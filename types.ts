export type Pet = {
  id: string;
  name: string;
  age: number;
  location: string;
  emoji?: string;
  assigned?: boolean;
  status: 'Fostering' | 'Adopted' | 'Transferred';
};

export type PetsViewListProps = {
  Pet: Pet;
  Mode: 'user' | 'admin';
  PressablePath: string;
};