import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DatePicker() {
  return (
    <DatePicker
      selected={startDate}
      onChange={handleChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
    />
  );
}
