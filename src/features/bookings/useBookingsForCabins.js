import { useQuery } from '@tanstack/react-query';
import { getBookingsForCabins } from '../../services/apiBookings';

export function useBookingsForCabins() {
  const { isLoading, data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => getBookingsForCabins(),
  });

  return { isLoading, bookings };
}
