import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from '@/providers/AuthProvider';

export const useAssignedPet = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['assignedPets'],
    queryFn: async () => {
      const { data: assignedPetIds, error: assignedPetIdsError } = await supabase
        .from('pet_assignments')
        .select('pet_id')
        .eq('assigned', true)
        .eq('user_id', user?.user_id);

      if (assignedPetIdsError) {
        throw new Error(assignedPetIdsError.message);
      }
      console.log('Assigned Pet IDs:', assignedPetIds);
      if (!assignedPetIds || assignedPetIds.length === 0) {
        return [];
      }
      return assignedPetIds;
    }
  })
};