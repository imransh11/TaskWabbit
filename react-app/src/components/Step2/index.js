import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from '../../store/session';
import { useParams } from "react-router-dom";
import { getTasks } from '../../store/tasks';
import './Step2.css'

function Step2({ onStepComplete, taskers}){
    const [taskerId, setTaskerId] = useState(null);
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user)
    const { taskTypeId } = useParams();

    const handleSelectTasker= (taskerId) => {
        const selectedTasker = filteredTaskers.find(tasker => tasker.id === taskerId);
        const taskType = selectedTasker.taskerTaskTypes.find(taskType => taskType.taskType_id == taskTypeId);
        // console.log('THE TASKTYPE', taskType.hourlyRate)
        const trustAndSupportFee = 12.54;
        // const totalRate = Number(taskType.hourlyRate) + trustAndSupportFee;

        setTaskerId(taskerId);
        onStepComplete({
            'tasker_id': taskerId,
            'trustAndSupportFee': trustAndSupportFee.toFixed(2),
            'tasker_name': `${selectedTasker.firstName} ${selectedTasker.lastName}`,
            'hourlyRate': taskType.hourlyRate,
            'totalPrice': (Number(taskType.hourlyRate) + Number(trustAndSupportFee)).toFixed(2)
        });
    }

    const handleBack = () => {
        onStepComplete({ back: true });
    };

    useEffect(() => {
        dispatch(authenticate());
    }, [dispatch])

    useEffect(() => {
        dispatch(getTasks())
    }, [dispatch])

    const tasks = useSelector(state => state.tasks.tasks)
    console.log('THE TASKS', tasks)

    const filteredTaskers = taskers.filter((tasker) => {
        // console.log('In the loop', tasker)
        if(tasker.id === user.id) {
            // console.log(`Tasker ${tasker.id} has the same ID as the user, excluding`);
            return false;
        }
        for (let i = 0; i < tasker.taskerTaskTypes.length; i++){
            let taskType = tasker.taskerTaskTypes[i].taskType_id
            if(taskTypeId == taskType){
                return true
            }
        }
        return false
    })

    // console.log('LALALA', filteredTaskers)

    function countTaskerTasks(taskerId, taskTypeId) {
        let count = 0
        for (let i = 0; i < tasks.length; i++){
            let tasktype = tasks[i].taskTypeId
            if((taskerId == tasks[i].tasker_id) && (tasktype == taskTypeId)){
                count = count + 1
            }

        }
        return count
    }



    return (
        <div>
            <label>
                Choose your tasker:
                    {filteredTaskers.length > 0 ? (
                        filteredTaskers.map((tasker) => (
                            <div key={tasker.id}>
                                <div>
                                    <h2>{tasker.firstName}</h2>
                                    <p>{tasker.taskerTaskTypes.find(taskType => taskType.taskType_id == taskTypeId).hourlyRate}/hr</p>
                                </div>
                                <p>({tasker.reviews.length} reviews)</p>
                                <p>Tasks done: {countTaskerTasks(tasker.id, taskTypeId)}</p>
                                <p>{tasker.reviews[0] ? tasker.reviews[0].description : 'No reviews'}</p>
                                <button onClick={() => handleSelectTasker(tasker.id)}>Select and continue</button>
                            </div>
                        ))
                    ) : (
                        <p>No taskers available</p>
                    )}
            </label>
            <button type="button" onClick={handleBack}>
                Back
            </button>
        </div>
    )
}


export default Step2
