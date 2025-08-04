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
      console.log('Assigning user to pet with data:', assignData);
      const { data: assignedData, error } = await supabase
        .from('pet_assignments')
        .insert(assignData)
        .single();

      if (error) {
        throw new Error(error.message);
      }
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

export const useDeassignUserFromPet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(deassignData: any){
      console.log('Deassigning user from pet with data:', deassignData);
      const { data: deassignedData, error } = await supabase
        .from('pet_assignments')
        .update(deassignData)
        .eq('user_id', deassignData.user_id)
        .eq('pet_id', deassignData.pet_id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return deassignedData;
    },
    async onSuccess (_, { deassignData }) {
      await queryClient.invalidateQueries({ queryKey: ['assignedPets', deassignData.user_id] });
      await queryClient.invalidateQueries({ queryKey: ['assignedUser', deassignData.pet_id] });
    },
    async onError (error: any) {
      throw new Error(error.message || 'Failed to deassign user to pet.');
    }
  });
}