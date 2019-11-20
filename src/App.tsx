import React, {useState} from 'react';
import moment, {Moment} from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import classNames from 'classnames'; 
import {Meeting as MeetingType,Note} from './types';
import {State} from './redux/reducers';
import {updateMeeting} from './redux/actions';
import './App.css'


const Sidebar: React.FC<{}> = ({ children }) => {
  return <div className="sidebar">{children}</div>;
}
  
const MeetingSelector: React.FC<{meetings: MeetingType[], selected: number, onSelect: (idx: number) => void}> = ({ meetings, selected, onSelect }) => {
  return (
    <ul className="meetings-selector">
      {meetings.map((meeting, idx) => (
        <li className={classNames({active: idx === selected})} key={meeting.name} onClick={() => onSelect(idx)}>{meeting.name}</li>
      ))}
    </ul>
  );
}

const MeetingList: React.FC<{onAdd?: (s: string) => void, placeholder?: string}> = ({ onAdd, placeholder, children }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  return (
    <ul className="meeting-list">
      {children}
      {(onAdd && !editing) &&
        <li>
          <IconButton className="meeting-list-add" size="small" onClick={() => setEditing(true)}>
            <AddIcon />
          </IconButton>
        </li>
      }
      {onAdd && editing &&
        <li>
          <input
            className="meeting-list-input"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={placeholder}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                onAdd(value);
                setEditing(false);
                setValue("");
              }
            }}
            />
        </li>
      }
    </ul>
  );
}

const Meeting: React.FC<{meeting: MeetingType, onUpdate: (meeting: MeetingType) => void}> = ({ meeting, onUpdate }) => {
  const {name, asksForYou, asksForThem, notes} = meeting;
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
                  ]
                })
              }}
            >
              {asksForYou.map((ask, idx) => <li key={idx}>{ask}</li>)}
            </MeetingList>
          </div>
          <div className="asks-for-them">
            <h3>Asks For Them</h3>
            <MeetingList>
              {asksForThem.map((ask, idx) => <li key={idx}>{ask}</li>)}
            </MeetingList>
          </div>
        </div>
        <div className="meeting-content-column">
          <div className="notes">
            <h3>Notes</h3>
            <MeetingList>
              {notes.map(({date, content}, idx) => {
                return (
                  <li key={idx}>
                    <h4>{date.format('MMM DD')}</h4>
                    <MeetingList>
                      {content.map((note, idx) => <li key={idx}>{note}</li>)}
                    </MeetingList>
                  </li>
                );
              })}
            </MeetingList>
          </div>
        </div>
      </div>
    </div>
  );
}

const App: React.FC<{}> = () => {
  const meetings = useSelector<State, MeetingType[]>(state => state.meetings);
  const dispatch = useDispatch();
  const [meetingIdx, setMeetingIdx] = useState(0);
  return (
    <div className="App">
      <Sidebar>
        <MeetingSelector
          meetings={meetings}
          selected={meetingIdx}
          onSelect={idx => setMeetingIdx(idx)}
        />
      </Sidebar>
      <Meeting 
        meeting={meetings[meetingIdx]} 
        onUpdate={(updatedMeeting) => {
          dispatch(updateMeeting(updatedMeeting));
        }}
      />
    </div>
  );
}

export default App;
