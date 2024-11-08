import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit/dist";

const initialState = {
    tasksList:[],
    selectedTask:{},
    isLoading:false,
    error:'',
}

export const getTaskFromServer = createAsyncThunk(
    "Tasks/getTaskFromServer",
    async(_,{rejectWithValue}) => {
        const response = await fetch('http://localhost:8000/tasks')
        if(response.ok) {
            const data = await response.json()
            return data
        } 
        else {
            return rejectWithValue({error:'Failed to fetch data'})   
    }
});
const tasksSlice = createSlice({
    name:'tasksSlice',
    initialState,
    reducers: {
        addTaskToList:(state,action) => {
            const id = Math.random() * 100
            let task = {...action.payload,id}
            state.tasksList.push(task)
        },
        removeTaskFromList:(state,action) => {
            state.tasksList = state.tasksList.filter((task) => task.id !== action.payload.id)
        },
        updateTaskInList:(state,action) => {
            state.tasksList = state.tasksList.map((task) => task.id === action.payload.id ? action.payload : task )
        },
        setSelectedTask:(state,action) => {
            state.selectedTask = action.payload
        }

    },
    extraReducers: (builder) => {
        builder
           .addCase(getTaskFromServer.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getTaskFromServer.fulfilled, (state, action) => {
                state.error = ''
                state.isLoading = false
                state.tasksList = action.payload
            })
            .addCase(getTaskFromServer.rejected, (state, action) => {
                state.error = action.payload.error
                state.isLoading = false
                state.tasksList = []
            })
        }

})

export const {addTaskToList,removeTaskFromList,updateTaskInList,setSelectedTask} = tasksSlice.actions

export default tasksSlice.reducer