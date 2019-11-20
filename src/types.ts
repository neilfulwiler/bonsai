import {Moment} from 'moment';


export interface Note {
  date: Moment,
  content: string[],
}

export interface Meeting {
  name: string,
  asksForYou: string[],
  asksForThem: string[],
  notes: Note[],
}
