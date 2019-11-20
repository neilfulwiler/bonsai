import { Dispatch } from 'redux';
import firebase from '@firebase/app';
import { FirebaseAuth } from '@firebase/auth-types';
import db from '../firebase';
import { PreMeeting, Meeting, User } from '../types';

export const LOGGED_IN = 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';
export const ADD_MEETING = 'ADD_MEETING';
export const SET_MEETINGS = 'SET_MEETINGS';
export const UPDATE_MEETING = 'UPDATE_MEETING';

export interface SetMeetings {
  type: typeof SET_MEETINGS,
  meetings: Meeting[],
}

export interface AddMeeting {
  type: typeof ADD_MEETING,
  meeting: Meeting,
}

export interface UpdateMeeting {
  type: typeof UPDATE_MEETING,
  meeting: Meeting,
}

export interface LoggedIn {
  type: typeof LOGGED_IN,
  user: any,
}

export interface LoggedOut {
  type: typeof LOGGED_OUT,
}

export type Action = LoggedIn | LoggedOut | SetMeetings | UpdateMeeting | AddMeeting;

export function attemptLogIn(dispatch: (x: (dispatch: Dispatch<Action>) => void) => void): void {
  if (!firebase.auth) {
    return;
  }
  const _auth = firebase.auth();
  (_auth as FirebaseAuth).signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((result) => {
    dispatch(logIn(result.user as User));
  });
}

export function attemptLogOut(dispatch: (x: (dispatch: Dispatch<Action>) => void) => void): void {
  if (!firebase.auth) {
    return;
  }
  firebase.auth().signOut().then(() => {
    dispatch((d) => d({ type: LOGGED_OUT }));
  });
}


export function logIn(user: User): ((dispatch: Dispatch<Action>) => void) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: LOGGED_IN, user });
    db.collection('meetings').where('uid', '==', user.uid).get().then((snapshot) => {
      dispatch({
        type: SET_MEETINGS,
        meetings: snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }) as Meeting),
      });
    });
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

// TODO add security rule for adding a meeting to other peoples collections
export function addMeeting(meeting: PreMeeting): ((dispatch: Dispatch<Action>) => void) {
  return (dispatch) => {
    db.collection('meetings').add({
      ...meeting,
    }).then(({ id }) => {
      dispatch({ type: ADD_MEETING, meeting: { ...meeting, id } });
    });
  };
}

export function updateMeeting(meeting: Meeting): ((dispatch: Dispatch<Action>) => void) {
  return (dispatch) => {
    const { id, ...rest } = transform(meeting);
    dispatch({ type: UPDATE_MEETING, meeting });
    db.collection('meetings').doc(id).set(rest, { merge: true });
  };
}
