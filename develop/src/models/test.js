//默认state
const defaultState = {
    count: 0
}

export default {
    namespace: 'test',
    state: {
        ...defaultState
    },
    effects: {
        * increment({}, {
            call,
            put,
            select
        }) {
            put({
                type: "setCount",
                count: 123
            })
        }
    },
    reducers: {
        setCount(state = defaultState, action = {}) {
            return Object.extend({}, state, {
                count: action.count
            })
        }
    }
};