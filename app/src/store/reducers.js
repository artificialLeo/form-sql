import { GET_DATA } from "./actions";
import axios from "axios";

const setData = (payload) => ({
    type: GET_DATA,
    payload
});

export const getData = () => async dispatch => {

    axios.get("http://localhost:4000/api/users/").then(response => {
        console.log(response)
        dispatch(setData(response.data))
    });
};

///*, DELETE_DATA, BOOL, N*/
// const setPost = () => ({
//     type: DELETE_DATA
// });
//
// const setBool = () => ({
//     type: BOOL
// });
//
// const setN = () => ({
//     type: N
// });

// export const getBool = () => async dispatch => {
//     dispatch(setBool());
// };
//
// export const getN = () => async dispatch => {
//     dispatch(setN());
// };

//
// export const deletePost = (deleteId, authUserMail) => async dispatch => {
//     axios.put("http://localhost:4000/api/users/", { params: { id: deleteId, mail: authUserMail }})
//     dispatch(setPost());
// };

