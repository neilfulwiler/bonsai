import { Moment } from 'moment';


export interface Note {
  date: Moment,
  content: string[],
}

export interface PreMeeting {
  uid: string,
  name: string,
  asksForYou: string[],
  asksForThem: string[],
  notes: Note[],
}

export interface User {
  uid: string,
}

export type Meeting = PreMeeting & {id: string};
