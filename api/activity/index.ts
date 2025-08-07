import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAllPetActivity = (pet_id: string) => {
  return useQuery({
    queryKey: ['allPetActivity', pet_id],
    queryFn: async () => {
      console.log(`Fetching all activity logs for pet_id: ${pet_id}`);
      const { data: allPetActivity, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          category_1:category_1_id ( name, emoji ),
          category_2:category_2_id ( name, emoji )
        `)
        .eq('pet_id', pet_id)
        .order('event_time', { ascending: false });

      if (error) {
        console.log('Error fetching all pet activity:', error);
        throw new Error(error.message);
      }

      if (!allPetActivity || allPetActivity.length === 0) {
        console.log(`No activity logs found for pet_id: ${pet_id}`);
        return [];
      }
      console.log(`Fetched ${allPetActivity.length} activity logs for pet_id: ${pet_id}`);

      return allPetActivity.map(log => ({
        ...log,
        category_1_name: log.category_1?.name || null,
        category_1_emoji: log.category_1?.emoji || null,
        category_2_name: log.category_2?.name || null,
        category_2_emoji: log.category_2?.emoji || null,
      }));
    }
  });
};

export const usePetActivity = (activity_id: string) => {
  return useQuery({
    queryKey: ['petActivity',  activity_id],
    queryFn: async () => {
      const { data: petActivity, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          category_1:category_1_id ( name, emoji ),
          category_2:category_2_id ( name, emoji )
        `)
        .eq('id', activity_id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!petActivity) {
        return null;
      }

      return {
        ...petActivity,
        category_1_name: petActivity.category_1?.name || null,
        category_1_emoji: petActivity.category_1?.emoji || null,
        category_2_name: petActivity.category_2?.name || null,
        category_2_emoji: petActivity.category_2?.emoji || null,
      };
    }
  });
}
// 🔹 INSERT Activity Log
export const useInsertActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn (newLog: any) {
      const { data, error } = await supabase
        .from('activity_logs')
        .insert(newLog)
        .select()
        .single();
      if (error) {
        throw new Error(error.message || 'Failed to insert activity log.');
      }
      return data;
    },
    async onSuccess(_, newLog) {
      await queryClient.invalidateQueries({ queryKey: ['allPetActivity', newLog.pet_id] });
    }
  });
} 

// 🔹 UPDATE Activity Log
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn (updatedLog: any) {
      const { activity_id, ...fieldsToUpdate } = updatedLog;
      const { data, error } = await supabase
        .from('activity_logs')
        .update(fieldsToUpdate)
        .eq('id', activity_id)
        .select()
        .single();
      if (error) {
        throw new Error(error.message || 'Failed to update activity log.');
      }
      return data;
    },
    async onSuccess(_, updatedLog: any) {
      await queryClient.invalidateQueries({ queryKey: ['allPetActivity', updatedLog.pet_id] });
      await queryClient.invalidateQueries({ queryKey: ['petActivity', updatedLog.activity_id] });
    }
  });
}

// 🔹 DELETE Activity Log
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn (activity_id: string) {
      const { data, error } = await supabase
        .from('activity_logs')
        .delete()
        .eq('id', activity_id)
        .select()
        .single();
      if (error) {
        throw new Error(error.message || 'Failed to delete activity log.');
      }
      return data;
    },
    async onSuccess(_, activity_id: string) {
      await queryClient.invalidateQueries({ queryKey: ['allPetActivity'] });
      await queryClient.invalidateQueries({ queryKey: ['petActivity', activity_id] });
    }
  });
}