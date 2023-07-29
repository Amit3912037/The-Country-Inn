import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';
import { useBookingsForCabins } from './useBookingsForCabins';
import Select from '../../ui/Select';
import { useCreateBooking } from './useCreateBooking';
import { intervalToDuration } from 'date-fns';
import Textarea from '../../ui/Textarea';
import { useCreateGuest } from './useCreateGuest';
import { useCabins } from '../cabins/useCabins';
import { useNavigate } from 'react-router-dom';

function CreateBookingForm() {
  const { register, formState, setValue, handleSubmit, clearErrors } = useForm({
    mode: 'onChange',
  });
  const { errors } = formState;
  const { bookings } = useBookingsForCabins();
  const { cabins } = useCabins();
  const { isCreating, createBooking } = useCreateBooking();
  const { isCreating: isCreatingGuest, createGuest } = useCreateGuest();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [selectedCabinId, setSelectedCabinId] = useState(null);
  const [availableCabins, setAvailableCabins] = useState([]);
  const navigate = useNavigate();

  function handleChange(range) {
    const [selectedStartDate, selectedEndDate] = range;
    console.log(selectedEndDate);
    setStartDate(selectedStartDate);
    setEndDate(selectedEndDate);
    if (selectedStartDate && selectedEndDate) {
      clearErrors('date');
    }
    if (bookings && selectedStartDate && selectedEndDate) {
      const bookedCabinsIds = [];
      bookings.forEach(
        ({
          startDate: bookingStartDate,
          endDate: bookingEndDate,
          cabins: { id },
        }) => {
          const d1 = new Date(selectedStartDate);
          const d2 = new Date(selectedEndDate);
          const d3 = new Date(bookingStartDate);
          const d4 = new Date(bookingEndDate);
          if (!(d1 >= d4 || d2 <= d3)) bookedCabinsIds.push(id);
        }
      );
      const emptyCabins = cabins
        .filter(({ id }) => !bookedCabinsIds.includes(id))
        .map(({ id, name, maxCapacity, discount, regularPrice }) => ({
          value: id,
          label: name + ` (${maxCapacity})`,
          cabinPrice: regularPrice - discount,
          maxCapacity: maxCapacity,
        }));
      if (emptyCabins.length > 0) {
        setSelectedCabinId(emptyCabins[0].value);
        setValue('cabinPrice', emptyCabins[0].cabinPrice);
      }
      setAvailableCabins(emptyCabins);
    } else {
      setSelectedCabinId(null);
      setValue('cabinPrice', null);
    }
  }
  function handleCabinChange(e) {
    const cabinPrice = e.target.options[e.target.selectedIndex].dataset.price;
    setSelectedCabinId(Number(e.target.value));
    if (cabinPrice) setValue('cabinPrice', cabinPrice);
  }
  function onSubmit({
    cabinPrice,
    numGuests,
    emailId,
    guestName,
    description,
    nationalId,
  }) {
    const newGuest = {
      email: emailId,
      fullName: guestName,
      nationalID: nationalId,
    };
    createGuest(newGuest, {
      onSuccess: (data) => {
        const newBooking = {
          startDate,
          endDate,
          numNights: intervalToDuration({
            start: startDate,
            end: endDate,
          }).days,
          numGuests: Number(numGuests),
          cabinPrice: Number(cabinPrice),
          totalPrice: Number(cabinPrice),
          status: 'unconfirmed',
          isPaid: false,
          hasBreakfast: false,
          cabinId: selectedCabinId,
          guestId: data.id,
          observations: description,
        };
        createBooking(newBooking, {
          onSuccess: (data) => {
            navigate(`/bookings/${data.id}`, { replace: true });
          },
        });
      },
    });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="Select Booking Date"
        isDatePicker={true}
        error={errors?.date?.message}
      >
        <div>
          <DatePicker
            disabled={isCreating || isCreatingGuest}
            wrapperClassName="date_picker full-width"
            selected={startDate}
            onChange={handleChange}
            startDate={startDate}
            dateFormat="dd MMM yy"
            minDate={new Date()}
            endDate={endDate}
            selectsRange
            customInput={
              <Input
                id="date"
                {...register('date', {
                  validate: () => {
                    if (startDate.getTime() === endDate.getTime())
                      return 'Please do not select same dates';
                    if (!startDate || !endDate)
                      return 'Please select a valid date';
                  },
                })}
              />
            }
          />
        </div>
      </FormRow>

      <FormRow label="Select Cabin">
        <Select
          disabled={!selectedCabinId || isCreating || isCreatingGuest}
          options={availableCabins}
          onChange={handleCabinChange}
        />
      </FormRow>

      <FormRow label="Cabin Price">
        <Input
          disabled
          type="number"
          id="cabinPrice"
          {...register('cabinPrice', {
            required: 'Select a valid date to choose cabin',
          })}
        />
      </FormRow>

      <FormRow label="Guest Name" error={errors?.guestName?.message}>
        <Input
          disabled={isCreating || isCreatingGuest}
          type="text"
          id="guestName"
          defaultValue=""
          {...register('guestName', {
            required: 'This field is required',
          })}
        />
      </FormRow>
      <FormRow label="Guest National ID" error={errors?.nationalId?.message}>
        <Input
          disabled={isCreating || isCreatingGuest}
          type="text"
          id="nationalId"
          defaultValue=""
          {...register('nationalId', {
            required: 'This field is required',
          })}
        />
      </FormRow>
      <FormRow label="Guest email ID" error={errors?.emailId?.message}>
        <Input
          disabled={isCreating || isCreatingGuest}
          type="email"
          id="emailId"
          defaultValue=""
          {...register('emailId', {
            required: 'This field is required',
          })}
        />
      </FormRow>
      <FormRow label="Number of Guests" error={errors?.numGuests?.message}>
        <Input
          disabled={isCreating || isCreatingGuest}
          type="number"
          id="numGuests"
          defaultValue=""
          {...register('numGuests', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Minimum 1 guest',
            },
            max: {
              value:
                availableCabins.length > 0 &&
                selectedCabinId &&
                availableCabins.filter(
                  (cabin) => cabin.value === selectedCabinId
                )[0].maxCapacity,
              message: 'Guests should be less than cabin capacity',
            },
          })}
        />
      </FormRow>
      <FormRow
        label="Description for booking"
        error={errors?.description?.message}
      >
        <Textarea
          disabled={isCreating || isCreatingGuest}
          type="text"
          id="description"
          defaultValue=""
          // disabled={isWorking}
          {...register('description')}
        />
      </FormRow>
      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          disabled={isCreating || isCreatingGuest}
        >
          Cancel
        </Button>
        <Button disabled={isCreating || isCreatingGuest}>Create Booking</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
