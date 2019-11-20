import { Dispatch } from 'redux';

import db from '../firebase';
import { Meeting } from '../types';

export const LOGGED_IN = 'LOGGED_IN';
export const SET_MEETINGS = 'SET_MEETINGS';
export const UPDATE_MEETING = 'UPDATE_MEETING';

export interface SetMeetings {
  type: typeof SET_MEETINGS,
  meetings: Meeting[],
}

export interface UpdateMeeting {
  type: typeof UPDATE_MEETING,
  meeting: Meeting,
}

export interface LoggedIn {
  type: typeof LOGGED_IN,
  user: any,
}

export interface User {
  id: string,
}

export type Action = LoggedIn | SetMeetings | UpdateMeeting;

export function logIn(user: User) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: LOGGED_IN, user });
  };
}

function transform({
  id, uid, name, asksForYou, asksForThem, notes,
}: Meeting): {id: string, uid: string, name: string, asksForYou: string[], asksForThem: string[], notes: {date: number, content: string[]}[]} {
  return {
    id,
    uid,
    name,
    asksForYou,
    asksForThem,
    notes: notes.map(({ date, ...rest }) => ({ date: date.unix(), ...rest })),
  };
}

export function updateMeeting(meeting: Meeting): ((dispatch: Dispatch<Action>) => void) {
  return (dispatch) => {
    const { id, ...rest } = transform(meeting);
    dispatch({ type: UPDATE_MEETING, meeting });
    db.collection('meetings').doc(id).set(rest, { merge: true });
  };
}
