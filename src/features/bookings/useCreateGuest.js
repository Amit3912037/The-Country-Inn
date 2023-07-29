import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createGuest as createGuestApi } from '../../services/apiGuests';

export function useCreateGuest() {
  // const queryClient = useQueryClient();

  const { mutate: createGuest, isLoading: isCreating } = useMutation({
    mutationFn: createGuestApi,
    // onSuccess: () => {
    //   toast.success('Guest successfully created');
    //   queryClient.invalidateQueries({ queryKey: ['guests'] });
    // },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createGuest };
}
