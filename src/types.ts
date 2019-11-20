import {Moment} from 'moment';


export interface Note {
  date: Moment,
  content: string[],
}

export interface Meeting {
  id: string,
  uid: string,
  name: string,
  asksForYou: string[],
  asksForThem: string[],
  notes: Note[],
}
