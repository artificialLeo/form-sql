export const GET_DATA = "GET_DATA";

export const DATA = "data";

export const selectDataList = state => state[DATA].data;

let initialState = {
    data: [],
};

export function reducer(state = initialState, {type, payload}) {
    switch (type) {
        case GET_DATA:
            return {
                ...state,
                data: payload
            };


        default:
            return state;
    }
}