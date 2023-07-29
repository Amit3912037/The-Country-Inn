import { useForm } from 'react-hook-form';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import Spinner from '../../ui/Spinner';
import { useSettings } from './useSettings';
import { useUpdateSetting } from './useUpdateSetting';

function UpdateSettingsForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const {
    isLoading,
    settings: {
      minBookingLength,
      maxBookingLength,
      maxGuestsPerBooking,
      breakfastPrice,
    } = {},
  } = useSettings();
  const { isUpdating, updateSetting } = useUpdateSetting();

  if (isLoading) return <Spinner />;

  function onSubmit(data) {
    updateSetting(data);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="Minimum nights/booking"
        error={errors?.minBookingLength?.message}
      >
        <Input
          type="number"
          id="min-nights"
          defaultValue={minBookingLength}
          disabled={isUpdating}
          {...register('minBookingLength', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Min nights should be 1',
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Maximum nights/booking"
        error={errors?.maxBookingLength?.message}
      >
        <Input
          type="number"
          id="max-nights"
          defaultValue={maxBookingLength}
          disabled={isUpdating}
          {...register('maxBookingLength', {
            required: 'This field is required',
            max: {
              value: 365,
              message: 'Max nights should be 365',
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Maximum guests/booking"
        error={errors?.maxGuestsPerBooking?.message}
      >
        <Input
          type="number"
          id="max-guests"
          defaultValue={maxGuestsPerBooking}
          disabled={isUpdating}
          {...register('maxGuestsPerBooking', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Guest should be more than 0',
            },
          })}
        />
      </FormRow>

      <FormRow label="Breakfast price" error={errors?.breakfastPrice?.message}>
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={breakfastPrice}
          disabled={isUpdating}
          {...register('breakfastPrice', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Price should be more than 0',
            },
          })}
        />
      </FormRow>
      <FormRow>
        <Button disabled={isUpdating}>Update Settings</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
