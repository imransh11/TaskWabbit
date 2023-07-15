import React from 'react';
import { useState, useEffect } from "react";
import { useModal } from '../../context/Modal';

function Step3({onStepComplete, existingData}){

    const { setModalContent, closeModal, setClickOutsideModal} = useModal();
    const [taskDate, setTaskDate] = useState(existingData.taskDate || "");
    const [error, setError] = useState("");

    const handleDateChange = (e) => {
        setTaskDate(e.target.value)
    }

    const validateDate = () => {
      let today = new Date()
      today.setHours(0, 0, 0, 0);

      let [year, month, day] = taskDate.split("-");
      let choosenDate = new Date(year, month-1, day);
      choosenDate.setHours(0, 0, 0, 0)

      // console.log(choosenDate, 'THE CHOOSEN DATE')
      // console.log(today, 'TODAY')

      if(choosenDate < today){
        // console.log(choosenDate, 'THE CHOOSEN DATE')
        // console.log(today, 'TODAY')
        return 'Cannot schedule task in the past'
      }
      return "";
    }

    const onSubmit = () => {
      const dataError = validateDate();

        if(!taskDate){
           setError('Date field is required')
            return;
        }else if(dataError){
          setError(dataError)
          return;
        }

        onStepComplete({'task_date': taskDate});
        setError(""); //reset errors
        closeModal();
    }

    const handleBack = () => {
        onStepComplete({ back: true });
        closeModal();
    };

    // Set modal content
  useEffect(() => {

    let isMounted = true;

    if (isMounted) {
        setClickOutsideModal(() => {});
        setModalContent(
        <div>
          <label>
            Choose the date for your task:
            <input
              type="date"
              value={taskDate}
              onChange={handleDateChange}
            />
          </label>
          {error && <p>{error}</p>}
          <button type="button" onClick={handleBack}>
            Back
          </button>
          <button onClick={onSubmit}>
            Next
          </button>
        </div>
        );
      }
    return () => {
      if (isMounted) {
        closeModal();
        setClickOutsideModal(() => closeModal); // reset clickOutsideModal
      }
      isMounted = false;
    };
  }, [taskDate, error]);

  return null;  // Return null because the actual content is rendered in the modal
}


export default Step3
