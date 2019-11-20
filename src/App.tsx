import React, {useState} from 'react';
import moment, {Moment} from 'moment';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import classNames from 'classnames'; 
import './App.css';


interface Note {
  date: Moment,
  content: string[],
}

interface Meeting {
  name: string,
  asksForYou: string[],
  asksForThem: string[],
  notes: Note[],
}

const Sidebar: React.FC<{}> = ({ children }) => {
  return <div className="sidebar">{children}</div>;
}

const MeetingSelector: React.FC<{meetings: Meeting[], selected: number, onSelect: (idx: number) => void}> = ({ meetings, selected, onSelect }) => {
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

const Meeting: React.FC<{meeting: Meeting, onUpdate: (meeting: Meeting) => void}> = ({ meeting, onUpdate }) => {
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
  const initialMeetings = [
    { name: "Alice", asksForYou: ["take out the trash", "buy groceries"], asksForThem: ["read a book", "draw a picture"], 
    notes: [{date: moment("2019-11-19", 'YYYY-MM-DD'), content: ["went for a walk", "looked up a definition"]}] }, 
    { name: "Bob", asksForYou: ["be nice", "come up with a plan"], asksForThem: ["write a song", "learn the guitar"],
    notes: [{date: moment("2019-11-17", 'YYYY-MM-DD'), content: ["played the piano", "practiced the guiater"]}] }, 
    { name: "Charlie", asksForYou: ["learn how to drive", "climb a mountain"], asksForThem: ["retake the exam", "go shopping"],
    notes: [{date: moment("2019-10-10", 'YYYY-MM-DD'), content: ["talked about the future", "did the laundry"]}] }, 
  ];
  const [meetings, setMeetings] = useState(initialMeetings);
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
          const idx = meetings.indexOf(meetings[meetingIdx]);
          console.log(`updating meeting ${idx}`);
          setMeetings(
            meetings.slice(0, idx).concat(updatedMeeting).concat(
              meetings.slice(idx + 1, meetings.length)
            )
          )
        }}
      />
    </div>
  );
}

export default App;
