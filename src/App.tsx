import { useState, useRef, useEffect } from 'react'
import './App.css'
import { Box, TextField } from '@mui/material'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function App() {
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [display, setDisplay] = useState('none');
  const bookingWindowRef = useRef(null);
  const [rows, setRows] = useState<string[]>([]);
  const [guestName, setGuestName] = useState("");
  const [room, setRoom] = useState("");
  const [selectedCabanaId, setSelectedCabanaId] = useState(-1);

  const images = {
    cabana: "/cabana.png",
    pool: "/pool.png",
    chalet: "/houseChimney.png",
    pathCorner: "/arrowCornerSquare.png",
    pathCross: "/arrowCrossing.png",
    pathEnd: "/arrowEnd.png",
    pathSplit: "/arrowSplit.png",
    pathStraight: "/arrowStraight.png",
  };

  const baseButtonStyles = {
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    lineHeight: 1.5,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  };

  const SubmitButton = styled(Button)({
    ...baseButtonStyles,
    border: 'none',
    backgroundColor: '#111111',

    '&:hover': {
      backgroundColor: '#555555',
      boxShadow: 'none',
    },

    '&:active': {
      backgroundColor: '#777777',
      boxShadow: 'none',
    },
  });

  const CancelButton = styled(Button)({
    ...baseButtonStyles,
    color: '#111111',
    border: '1px solid #111111',
    backgroundColor: 'transparent',

    '&:hover': {
      backgroundColor: '#CCCCCC',
      boxShadow: 'none',
    },

    '&:active': {
      backgroundColor: '#999999',
      boxShadow: 'none',
    },
  });

  useEffect(() => {
    loadMap();
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/api/map")
      .then(res => res.json())
      .then(data => {
        setRows(data.rows);
      });
    }, []);

  async function loadMap() {
    const res = await fetch("http://localhost:3000/api/map");
    const data = await res.json();

    setRows(data.rows);
  }

  function bookCabana(e: React.FormEvent) {
    e.preventDefault();

    fetch("http://localhost:3000/api/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guestName,
        room,
        cabanaId: selectedCabanaId,
      }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
          loadMap();
          closeBookingWindow();
          alert("Booked!");
        } else {
          alert(data.message);
        }
    });
  }

  function bookingWindowPos(el, id) {
    setDisplay('flex');
    setTop(el.offsetTop);
    setLeft(el.offsetLeft);
    setSelectedCabanaId(id);
  }

  function closeBookingWindow() {
    setDisplay('none');
  }

  return (
    <>
      <div className='map'>
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1, width: '20ch' } }}
          noValidate
          autoComplete="off"
          className='booking-window'
          id='booking-window'
          ref={bookingWindowRef}
          style={{ top, left, display }}
          onSubmit={bookCabana}
        >
          <h5>Booking form</h5>
          <TextField label="Full name" variant="outlined" size="small" 
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
          <TextField label="Room №" variant="outlined" size="small"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <Stack direction="row" className='buttons-container'>
            <CancelButton variant="outlined" onClick={() => closeBookingWindow()}>Cancel</CancelButton>
            <SubmitButton variant="contained" type='submit'>Submit</SubmitButton>
          </Stack>
        </Box>
        {rows.map((row, y) => (
          <div className='row' key={y}>
            {[...row].map((cell, x) => 
            cell.type === 'empty' ? (
              <div
                key={`${x}-${y}`}
                className='tile'
              >
              </div>
            ) : (
              cell.type === 'path' ? (
                <img
                  src={images[cell.type + cell.shape[0][0].toUpperCase() + cell.shape[0].slice(1)]}
                  key={`${x}-${y}`}
                  className={`tile rotate-${cell.shape[1]}`}
                />
              ) : (
                cell.type === 'cabana' ? (
                  <img
                    src={images[cell.type]}
                    className={`tile cabana ${cell.available ? '' : 'booked-cabana'}`}
                    onClick={(e) => bookingWindowPos(e.currentTarget, cell.id)}
                  />
                ) : (
              <img
                src={images[cell.type]}
                className='tile'
                key={`${x}-${y}`}
                alt={cell}
              />
            ))))}
          </div>
        ))}
        <script src='input.js'></script>
      </div>
    </>
  )
}

export default App
