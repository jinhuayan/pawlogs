import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
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