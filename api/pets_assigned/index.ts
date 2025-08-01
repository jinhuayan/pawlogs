import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
        .eq('pet_id', pet_id)
        .single();

      if (assignedUserIdError) {
        throw new Error(assignedUserIdError.message);
      }
      console.log('Assigned User ID:', assignedUserId);
      if (!assignedUserId) {
        return null;
      }
      return assignedUserId;
    }
  })
};

export const useAssignUserToPet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(assignData: any){
      const { data: assignedData, error } = await supabase
        .from('pet_assignments')
        .insert(assignData)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      console.log('Assigned User to Pet:', assignedData);
      return assignedData;
    },
    async onSuccess (_, { assignData }) {
      await queryClient.invalidateQueries({ queryKey: ['assignedPets', assignData.user_id] });
      await queryClient.invalidateQueries({ queryKey: ['assignedUser', assignData.pet_id] });
    },
    async onError (error: any) {
      throw new Error(error.message || 'Failed to assign user to pet.');
    }
  });
}