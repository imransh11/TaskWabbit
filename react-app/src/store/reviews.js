//constants
const GET_REVIEW_FOR_LOGGEDIN = 'taskwabbit/getReviewForLoggedIn'

//func
const reviewLoggedIn = (reviews) => {
    console.log('TEST--------------')
    return {
        type: GET_REVIEW_FOR_LOGGEDIN,
        payload: reviews
    }
}

//thunk
export const getReviewForLoggedIn = () => async (dispatch) => {
    console.log('getReviewForLoggedIn THUNK')
    const response = await fetch('/api/reviews/current')
    console.log(response, 'res in thunk Review')

    if(response.ok){
        const loadReviews = await response.json()
        console.log(loadReviews, 'Thunk Response')

        dispatch(reviewLoggedIn(loadReviews))

        return loadReviews
    }
}


//state
const initialState = {};

//reducer
const reviewReducer = (state = initialState, action) => {
    console.log('switch------')
    switch(action.type){
        case GET_REVIEW_FOR_LOGGEDIN: {
            console.log("IN RECUDER STATE")
            const newState = {}
            const userRev = action.payload.Reviews
            console.log(userRev, 'action----------')
            // console.log(userRev.payload.Reviews, 'Review ARRAY')
            userRev.forEach(rev => newState[rev.id] = rev)
            console.log(newState, "newSTATE")
            return newState
        }
        default:
            return state
    }
}


export default reviewReducer
