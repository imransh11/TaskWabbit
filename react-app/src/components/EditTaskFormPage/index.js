import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTask, updateTask, clearCurrentTask } from "../../store/tasks";
import { useHistory, useParams } from "react-router-dom";

function EditTaskFormPage(){
    const dispatch = useDispatch();
    const { taskId } = useParams();
    const history = useHistory();

    const task = useSelector(state => state.tasks.currentTask);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    // const [isPastDate, setIsPastDate] = useState(false);
    const [errors, setErrors] = useState({});
    const { id: loggedInUserId } = useSelector(state => state.session.user); // Fetch logged in user's ID
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const suggestionRef = useRef();
    const [showSuggestions, setShowSuggestions] = useState(false);

    const fetchSuggestions = async (input) => {
      const response = await fetch(`/api/auth/autocomplete/${input}`);
      const data = await response.json();
      setSuggestions(data);
    };

    useEffect(() => {
        if (inputValue) {
          fetchSuggestions(inputValue);
        } else {
          setSuggestions([]);
        }
    }, [inputValue]);

    const validateForm = () => {
      const errors = {}
      if(!title) errors.title = "Title is required";
      if(!description) errors.description = "A description is required";
      if(!location) errors.location = "A location is required";
      return errors
    }

    useEffect(() => {
        dispatch(getTask(taskId))
    }, [dispatch, taskId])

    useEffect(() => {
        if(task){
          console.log(task.user_id, 'task.user_Id')
          if (task.user_id !== loggedInUserId) {
            dispatch(clearCurrentTask());
            history.push('/tasks/current');
          }
            // const taskDate = new Date(task.task_date);
            // const currentDate = new Date();
            // currentDate.setHours(0,0,0,0) //set current time to 00:00:00
            // setIsPastDate(taskDate < currentDate);
            setTitle(task.title);
            setDescription(task.description);
            setLocation(task.location);
            setInputValue(task.location);
        }

    }, [task]);

    if(!task){
        return null; //dont forget to replace with loading spinner
    }


    const handleSubmit = async(e) => {
        e.preventDefault();

        const result = validateForm();
        if(Object.keys(result).length > 0){
          setErrors(result)
          return
        }


        const existingData = {
            "taskTypeId": task.taskTypeId,
            "user_id": task.user_id,
            "tasker_id": task.tasker_id,
            "task_date": task.task_date,
            "totalPrice": task.totalPrice
        }
        const taskData = {
            title,
            description,
            location: suggestionRef.current || location,
        }

        const finaltaskData = {
            ...existingData,
            ...taskData
        }

        const data = await dispatch(updateTask(taskId, finaltaskData));
        if(data && data.length > 0){
            setErrors(data);
        } else {
            history.push('/tasks/current')
        }
    }
    return (
      <div className="task-form-container">
        <div className="form-description">
          <p>Here you can edit your task so your tasker has the most updated information</p>
        </div>
        <form className="create-task-form"onSubmit={handleSubmit}>
          <div className="step1">
          <div className="step1-section">
          <label>
            <h3>Title</h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          {errors.title && <p>{errors.title}</p>}
          </div>
          <div  className="step1-section">
          <label>
            <h3>Description</h3>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          {errors.description && <p>{errors.description}</p>}
          </div>
          <div className="step1-section">
          <label>
            <h3>Location</h3>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setShowSuggestions(true)
              }
              }
            />
                <div className="location-suggestions">
                {showSuggestions && suggestions.map((suggestion, index) => (
                    <div
                        key={index}
                        onMouseDown={(e) => {
                            e.preventDefault()
                            // console.log('Clicked suggestion:', suggestion.description);
                            setInputValue(suggestion.description);
                            setLocation(inputValue);
                            suggestionRef.current = suggestion.description;
                            setSuggestions([]);
                            setShowSuggestions(false); // hide suggestions when a suggestion is clicked
                        }}w
                    >
                        {suggestion.description}
                    </div>
                ))}
                </div>
          </label>
          {errors.location && <p>{errors.location}</p>}
          </div>
          <button type="submit">Update Task</button>
          </div>
        </form>
        </div>

      );
}
export default EditTaskFormPage
