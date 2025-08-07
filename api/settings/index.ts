import { supabase } from "@/lib/supabase";
import { useMutation, useQuery,UseQueryOptions , useQueryClient } from "@tanstack/react-query";

export type Notification = {
  id: number;
  role: "admin" | "foster";
  active: boolean;
  interval_unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks';
  interval_value: number;
  // …other fields if you like
};

/**
 * Allow callers to pass any UseQueryOptions _except_
 * `queryKey` and `queryFn`, which we define internally.
 */
type FetchOptions = Omit<
  UseQueryOptions<Notification[], Error>,
  "queryKey" | "queryFn"
>;

export const useFetchNotification = (options?: FetchOptions) => {
  return useQuery<Notification[], Error>({
    queryKey: ['fetchNotification'],
    queryFn: async () => {
      const { data: fetchNotification, error: fetchNotificationError } = await supabase
        .from('notification_settings')
        .select('*');

      if (fetchNotificationError) {
        throw new Error(fetchNotificationError.message);
      }
      return fetchNotification || [];
    },
    ...options
  })
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(updateNotification: any) {
      console.log('Updating notification with data:', updateNotification);
      const { data: updatedNotification, error } = await supabase
        .from('notification_settings')
        .update(updateNotification)
        .eq('role', updateNotification.role)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedNotification;
    },
      async onSuccess (_, updatedNotification) {
        console.log('Notification updated successfully:', updatedNotification);
        await queryClient.invalidateQueries({ queryKey: ['fetchNotification'] });
        console.log('Invalidated fetchNotification query after update');
      },
      async onError (error) {
        console.error('Error updating notification:', error);
      }
  });
};

