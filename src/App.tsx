import React, { useEffect, useRef, useState } from 'react';
import firebase from '@firebase/app';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import classNames from 'classnames';
import { Meeting as MeetingType, Note, User } from './types';
import { State } from './redux/reducers';
import {
  logIn, attemptLogIn, attemptLogOut, addMeeting, updateMeeting,
} from './redux/actions';
import './App.css';


const Sidebar: React.FC<{}> = ({ children }) => <div className="sidebar">{children}</div>;

const AddButtonInput: React.FC<{placeholder?: string, onEnter: (s: string) => void}> = ({ placeholder, onEnter }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, editing]);
  return (
    <>
      {!editing
      && (
      <IconButton className="meeting-list-add" size="small" onClick={() => setEditing(true)}>
        <AddIcon />
      </IconButton>
      )}
      {editing
      && (
        <input
          ref={inputRef}
          className="meeting-list-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onEnter(value);
              setEditing(false);
              setValue('');
            }
          }}
        />
      )}
    </>
  );
};

const MeetingSelector: React.FC<{
  meetings: MeetingType[],
  selected?: number,
  onSelect: (idx: number) => void
}> = ({ meetings, selected, onSelect }) => {
  const dispatch = useDispatch();
  const user = useSelector<State, User | undefined>((state) => state.user);
  return (
    <ul className="meetings-selector">
      {meetings.map((meeting, idx) => (
        <li className={classNames({ active: idx === selected })} key={meeting.name} onClick={() => onSelect(idx)}>{meeting.name}</li>
      ))}
      {user
        && (
        <li className="add-meeting">
          <AddButtonInput onEnter={(name) => dispatch(addMeeting({
            name,
            uid: user.uid,
            asksForThem: [],
            asksForYou: [],
            notes: [],
          }))}
          />
        </li>
        )}
    </ul>
  );
};

const MeetingList: React.FC<{onAdd?: (s: string) => void, placeholder?: string}> = ({ onAdd, placeholder, children }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  return (
    <ul className="meeting-list">
      {children}
      {onAdd && (
      <li>
        <AddButtonInput onEnter={onAdd} placeholder={placeholder} />
      </li>
      )}
    </ul>
  );
};

function replaceIdx<T>(ls: T[], idx: number, t: T): T[] {
  return ls.splice(0, idx).concat([t]).concat(ls.splice(idx + 1, ls.length));
}

const Meeting: React.FC<{meeting: MeetingType, onUpdate: (meeting: MeetingType) => void}> = ({ meeting, onUpdate }) => {
  const {
    name, asksForYou, asksForThem, notes,
  } = meeting;
  return (
    <div className="meeting">
      <h1>{name}</h1>
      <div className="meeting-content">
        <div className="meeting-content-column asks">
          <div className="asks-for-you">
            <h3>Asks For You</h3>
            <MeetingList
              onAdd={(ask) => {
                onUpdate({
                  ...meeting,
                  asksForYou: [
                    ...asksForYou,
                    ask,
                  ],
                });
              }}
            >
              {asksForYou.map((ask, idx) => <li key={idx}>{ask}</li>)}
            </MeetingList>
          </div>
          <div className="asks-for-them">
            <h3>Asks For Them</h3>
            <MeetingList
              onAdd={(ask) => {
                onUpdate({
                  ...meeting,
                  asksForThem: [
                    ...asksForThem,
                    ask,
                  ],
                });
              }}
            >
              {asksForThem.map((ask, idx) => <li key={idx}>{ask}</li>)}
            </MeetingList>
          </div>
        </div>
        <div className="meeting-content-column">
          <div className="notes">
            <h3>Notes</h3>
            <MeetingList>
              {notes.map(({ date, content }, idx) => (
                <li key={idx}>
                  <h4>{date.format('MMM DD')}</h4>
                  <MeetingList
                    onAdd={(note) => {
                      onUpdate({
                        ...meeting,
                        notes: replaceIdx(notes, idx, { date, content: content.concat([note]) }),
                      });
                    }}
                  >
                    {content.map((note, idx) => <li key={idx}>{note}</li>)}
                  </MeetingList>
                </li>
              ))}
            </MeetingList>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const user = useSelector<State, User | undefined>((state) => state.user);
  return (
    <div
      className="log-in"
    >
      {!user && (
      <div
        className="log-in-button"
        onClick={() => attemptLogIn(dispatch)}
      >
      Log In
      </div>
      )}
      {user && (
      <div
        className="log-in-button"
        onClick={() => attemptLogOut(dispatch)}
      >
      Log Out
      </div>
      )}
    </div>
  );
};

const App: React.FC<{}> = () => {
  const meetings = useSelector<State, MeetingType[]>((state) => state.meetings);
  const dispatch = useDispatch();
  const [meetingIdx, setMeetingIdx] = useState(meetings.length > 0 ? 0 : undefined);
  useEffect(() => {
    console.log('running again');
    firebase.auth && firebase.auth().onAuthStateChanged((currentUser: User | null) => {
      if (currentUser) {
        dispatch(logIn(currentUser));
      }
    });
  }, []);
  useEffect(() => {
    if (meetingIdx === undefined && meetings.length > 0) {
      setMeetingIdx(0);
    } else if (meetingIdx && meetings.length === 0) {
      setMeetingIdx(undefined);
    }
  }, [meetings, setMeetingIdx, meetingIdx]);
  return (
    <>
      <Header />
      <div className="App">
        <Sidebar>
          <MeetingSelector
            meetings={meetings}
            selected={meetingIdx}
            onSelect={(idx) => setMeetingIdx(idx)}
          />
        </Sidebar>
        {meetingIdx !== undefined && meetingIdx < meetings.length
          && (
          <Meeting
            meeting={meetings[meetingIdx]}
            onUpdate={(updatedMeeting) => {
              dispatch(updateMeeting(updatedMeeting));
            }}
          />
          )}
      </div>
    </>
  );
};

export default App;
