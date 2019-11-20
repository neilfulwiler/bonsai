import moment from 'moment';
import {Meeting} from '../types';
import {SetMeetings} from './actions';


export interface State {
  meetings: Meeting[],
}


type Action = SetMeetings;


const initialState: State = {
  meetings: [
    { name: "Alice", asksForYou: ["take out the trash", "buy groceries"], asksForThem: ["read a book", "draw a picture"], 
    notes: [{date: moment("2019-11-19", 'YYYY-MM-DD'), content: ["went for a walk", "looked up a definition"]}] }, 
    { name: "Bob", asksForYou: ["be nice", "come up with a plan"], asksForThem: ["write a song", "learn the guitar"],
    notes: [{date: moment("2019-11-17", 'YYYY-MM-DD'), content: ["played the piano", "practiced the guiater"]}] }, 
    { name: "Charlie", asksForYou: ["learn how to drive", "climb a mountain"], asksForThem: ["retake the exam", "go shopping"],
    notes: [{date: moment("2019-10-10", 'YYYY-MM-DD'), content: ["talked about the future", "did the laundry"]}] }, 
  ],
}

export default function rootReducer(state = initialState, action: Action): State {
  return initialState;
}