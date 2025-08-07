import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from '@/providers/AuthProvider';
import { useAssignedPets } from "@/api/pets_assigned";

const getSpeciesEmoji = (species: string): string => {
  const emojiMap: Record<string, string> = {
    dog: '🐶',
    cat: '🐱',
    rabbit: '🐰',
    bird: '🐦',
    hamster: '🐹',
    guinea: '🐹',
    ferret: '🦡',
    turtle: '🐢',
    fish: '🐠',
    horse: '🐴',
    pig: '🐷',
    goat: '🐐',
    sheep: '🐑',
    cow: '🐄',
    duck: '🦆',
    chicken: '🐔',
    lizard: '🦎',
    frog: '🐸',
    snake: '🐍',
    hedgehog: '🦔',
    alpaca: '🦙',
    parrot: '🦜',
    other: '🦄',
  };

  // Find a matching emoji using partial match
  for (const key in emojiMap) {
    if (species.toLowerCase().includes(key)) {
      return emojiMap[key];
    }
  }

  return '🐾'; // default
};


export const usePetsList = () => {
  const { user, isAdmin } = useAuth();
  const assignedPetQuery = !isAdmin ? useAssignedPets(user.user_id).data : undefined;

  return useQuery({
    queryKey: ['pets'],
    enabled: isAdmin || (!!assignedPetQuery && assignedPetQuery.length > 0),
    queryFn: async () => {
      if (isAdmin) {
        const { data, error } = await supabase.from('pets').select('*');
        if (error) throw new Error(error.message);
        return data;
      }

      const assignedPetIds = assignedPetQuery ?? [];
      const { data: assignedPetsData, error: assignedPetsError } = await supabase
        .from('pets')
        .select('*')
        .in('pet_id', assignedPetIds.map((assignment: { pet_id: string }) => assignment.pet_id));
      if (assignedPetsError) {
        throw new Error(assignedPetsError.message);
      }
      return assignedPetsData;
    }
  });
  
};

export const usePetData = (pet_id: string) => {

  return useQuery({
    queryKey: ['petData', pet_id],
    queryFn: async () => {
      const { data: petData, error: petDataError } = await supabase
        .from('pets')
        .select('*')
        .eq('pet_id', pet_id)
        .single();
      if (petDataError) {
        throw new Error(petDataError.message);
      }
      return petData;
    }
  });
  
}

export const useInsertPet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(newPet: any) {
      const emoji = getSpeciesEmoji(newPet.species);

      const { data: newPetData, error } = await supabase
        .from('pets')
        .insert({
          name: newPet.name,
          species: newPet.species,
          breed: newPet.breed,
          gender: newPet.gender,
          status: newPet.status,
          profile_photo: newPet.profile_photo,
          dob: newPet.dob,
          location: newPet.location,
          emoji: emoji
        })
        .single();

      if (error) throw new Error(error.message);
      return newPetData;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
    async onError(error: any) {
      throw new Error(error.message || 'Failed to insert pet.');
    }
  });
};


export const useUpdatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(updatePet: any) {
      const emoji = getSpeciesEmoji(updatePet.species);

      const { data: updatedPetData, error } = await supabase
        .from('pets')
        .update({
          name: updatePet.name,
          species: updatePet.species,
          breed: updatePet.breed,
          gender: updatePet.gender,
          status: updatePet.status,
          dob: updatePet.dob,
          location: updatePet.location,
          emoji: emoji,
          profile_photo: updatePet.profile_photo
        })
        .eq('pet_id', updatePet.pet_id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return updatedPetData;
    },
    async onSuccess(_, updatePet) {
      await queryClient.invalidateQueries({ queryKey: ['pets'] });
      await queryClient.invalidateQueries({ queryKey: ['petData', updatePet.pet_id] });
    },
    async onError(error: any) {
      throw new Error(error.message || 'Failed to update pet.');
    }
  });
};
