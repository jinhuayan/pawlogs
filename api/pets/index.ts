import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from '@/providers/AuthProvider';
import { useAssignedPet } from "@/api/pets_assigned";

export const usePetsList = () => {
  const { isAdmin } = useAuth();
  const assignedPetQuery = !isAdmin ? useAssignedPet().data : undefined;

  return useQuery({
    queryKey: ['pets', isAdmin, assignedPetQuery],
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