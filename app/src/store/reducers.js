import { GET_DATA } from "./actions";
import axios from "axios";

const setData = (payload) => ({
    type: GET_DATA,
    payload
});

export const getData = () => async dispatch => {
    axios.get("http://localhost:4000/api/users/").then(response => dispatch(setData(response.data)));
};