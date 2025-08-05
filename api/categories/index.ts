import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const [category1Res, category2Res] = await Promise.all([
        supabase.from('category_1').select('id, name, emoji'),
        supabase.from('category_2').select('id, name, emoji, category_1_id')
      ]);

      if (category1Res.error) throw new Error(category1Res.error.message);
      if (category2Res.error) throw new Error(category2Res.error.message);

      return {
        category_1: category1Res.data,
        category_2: category2Res.data,
      };
    }
  });
};
