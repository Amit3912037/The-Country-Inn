import CreateBookingForm from '../features/bookings/CreateBookingForm';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

export default function NewBooking() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Create New Booking</Heading>
      </Row>
      <CreateBookingForm />;
    </>
  );
}
