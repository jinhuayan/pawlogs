import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from '@/providers/AuthProvider';

export const usePetList = () => {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      if (isAdmin) {
        const { data, error } = await supabase.from('pets').select('*');
        if (error) {
          throw new Error(error.message);
        }
        return data;
      }
      else {
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
        else {
          const { data: assignedPetsData, error: assignedPetsError } = await supabase
            .from('pets')
            .select('*')
            .in('pet_id', assignedPetIds.map((assignment: { pet_id: string }) => assignment.pet_id));
          if (assignedPetsError) {
          throw new Error(assignedPetsError.message);
        }
          return assignedPetsData;
        }
      }
    },

    });
}