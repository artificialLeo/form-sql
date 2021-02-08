export const GET_DATA = "GET_DATA";
export const DELETE_DATA = "DELETE_DATA";
// export const BOOL = "BOOL";
// export const N = "N";

export const DATA = "data";

export const selectDataList = state => state[DATA].data;

let initialState = {
    data: [],
    // bool: false,
    // n: 1,
};

export function reducer(state = initialState, {type, payload}) {
    switch (type) {
        case GET_DATA:
            return {
                ...state,
                data: payload
            };

        // Basic example
        // case BOOL:
        //     return {
        //         ...state,
        //         bool: !state.bool
        //     };
        // case N:
        //     return {
        //         ...state,
        //         n: state.n++
        //     };
        // case DELETE_DATA:
        //     return {
        //         ...state
        //     };


        default:
            return state;
    }
}