import moment from 'moment';
import { Meeting } from '../types';
import {
  LOGGED_IN, SET_MEETINGS, UPDATE_MEETING, Action,
} from './actions';


export interface State {
  meetings: Meeting[],
  user: any,
}

const initialState: State = {
  user: undefined,
  meetings: [
    {
      id: '1',
      uid: 'blah',
      name: 'Alice',
      asksForYou: ['take out the trash', 'buy groceries'],
      asksForThem: ['read a book', 'draw a picture'],
      notes: [{ date: moment('2019-11-19', 'YYYY-MM-DD'), content: ['went for a walk', 'looked up a definition'] }],
    },
    {
      id: '2',
      uid: 'blah',
      name: 'Bob',
      asksForYou: ['be nice', 'come up with a plan'],
      asksForThem: ['write a song', 'learn the guitar'],
      notes: [{ date: moment('2019-11-17', 'YYYY-MM-DD'), content: ['played the piano', 'practiced the guiater'] }],
    },
    {
      id: '3',
      uid: 'blah',
      name: 'Charlie',
      asksForYou: ['learn how to drive', 'climb a mountain'],
      asksForThem: ['retake the exam', 'go shopping'],
      notes: [{ date: moment('2019-10-10', 'YYYY-MM-DD'), content: ['talked about the future', 'did the laundry'] }],
    },
  ],
};

function replace<T>(ls: T[], pred: (t: T) => boolean, x: T): T[] {
  const idx = ls.findIndex(pred);
  return ls.slice(0, idx).concat([x]).concat(ls.slice(idx + 1, ls.length));
}

export default function rootReducer(state = initialState, action: Action): State {
  switch (action.type) {
    case LOGGED_IN:
      return {
        ...state,
        user: action.user,
      };
    case SET_MEETINGS:
      return {
        ...state,
        meetings: action.meetings,
      };
    case UPDATE_MEETING:
      return {
        ...state,
        meetings: replace(state.meetings, (m) => m.id === action.meeting.id, action.meeting),
      };

    default:
      return state;
  }
}
