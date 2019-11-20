import {Dispatch} from 'redux';
import {Meeting} from '../types';

export type SET_MEETINGS = 'SET_MEETINGS';

export interface SetMeetings {
  type: SET_MEETINGS;
}

type Action = SetMeetings;

export function updateMeeting(meeting: Meeting): ((dispatch: Dispatch<Action>) => void) {
  return (dispatch) => {};
}