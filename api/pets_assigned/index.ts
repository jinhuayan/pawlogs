import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useAssignedPets = (user_id: string) => {
  return useQuery({
    queryKey: ['assignedPets', user_id],
    queryFn: async () => {
      const { data: assignedPetIds, error: assignedPetIdsError } = await supabase
        .from('pet_assignments')
        .select('pet_id')
        .eq('assigned', true)
        .eq('user_id', user_id);

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

export const useAssignedUser = (pet_id: string) => {
  return useQuery({
    queryKey: ['assignedUser', pet_id],
    queryFn: async () => {
      const { data: assignedUserId, error: assignedUserIdError } = await supabase
        .from('pet_assignments')
        .select('user_id')
        .eq('assigned', true)
        .eq('pet_id', pet_id);

      if (assignedUserIdError) {
        throw new Error(assignedUserIdError.message);
      }
      console.log('Assigned User ID:', assignedUserId);
      if (!assignedUserId || assignedUserId.length === 0) {
        return [];
      }
      return assignedUserId;
    }
  })
};