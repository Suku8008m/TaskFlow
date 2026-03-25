export const initialState = [];

export function taskReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload;
    case 'ADD_TASK':
      return [
        { 
          id: crypto.randomUUID(), 
          ...action.payload, 
          completed: false, 
          createdAt: Date.now() 
        }, 
        ...state
      ];
    case 'TOGGLE_TASK':
      return state.map(task => 
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
    case 'DELETE_TASK':
      return state.filter(task => task.id !== action.payload);
    case 'EDIT_TASK':
      return state.map(task =>
        task.id === action.payload.id ? { ...task, text: action.payload.text } : task
      );
    default:
      return state;
  }
}
