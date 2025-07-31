import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from '@/providers/AuthProvider';

export const useUsersList = () => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ['usersList'],
    queryFn: async () => {

      if (!isAdmin) {
        console.warn('Unauthorized access attempt to users list');
        return [];
      }

      const { data: usersList, error: usersListError } = await supabase
        .from('users')
        .select('*');

      if (usersListError) {
        throw new Error(usersListError.message);
      }
      if (!usersList || usersList.length === 0) {
        return [];
      }
      return usersList;
    }
  })
};

export const useUserData = (user_id: string) => {
  return useQuery({
    queryKey: ['userData', user_id],
    queryFn: async () => {
      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id)
        .single();

      if (userDataError) {
        throw new Error(userDataError.message);
      }
      return userData;
    }
  })
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn({ user_id, updatedFields }: { user_id: string, updatedFields: Record<string, any> }) {
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(updatedFields)
        .eq('user_id', user_id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedUser;
    },
    async onSuccess(_, variables) {
      await queryClient.invalidateQueries({ queryKey: ['usersList'] });
      await queryClient.invalidateQueries({ queryKey: ['userData', variables.user_id] });
    }
  });
};