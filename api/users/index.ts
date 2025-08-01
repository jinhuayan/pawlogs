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
    async mutationFn(updateUser: any) {
      console.log('Updating user with data:', updateUser);
      const { data: updatedUserData, error } = await supabase
        .from('users')
        .update(updateUser)
        .eq('user_id', updateUser.user_id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        throw new Error(error.message);
      }
      return updatedUserData;
    },
    async onSuccess(_, user_id) {
      console.log('This User updated successfully:', user_id);
      await queryClient.invalidateQueries({ queryKey: ['usersList'] });
      await queryClient.invalidateQueries({ queryKey: ['userData', user_id.user_id] });
    },
    async onError(error) {
      console.error('Error updating user:', error);
      throw error;
    }
  });
};