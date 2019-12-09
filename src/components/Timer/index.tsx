import React, { useState } from 'react';
import styled from 'styled-components';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import toggleScrollEvent from '../../util/functions/toggleScrollEvent';

interface Props {
  onChangeHour: Function;
  onChangeMinute: Function;
}

const Timer: React.FC<Props> = (props) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    props.onChangeHour(date.getHours());
    props.onChangeMinute(date.getMinutes());
  };

  return (
    <TimerWrapper className="Timer">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <ThemeProvider theme={defaultMaterialTheme}>
          <TimePicker
            value={selectedDate}
            onChange={handleDateChange}
            onOpen={() => {
              toggleScrollEvent(true);
            }}
            onClose={() => {
              toggleScrollEvent(false);
              setTimeout(() => {
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
              }, 200);
            }}
          />
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    </TimerWrapper>
  );
};

export default Timer;

const TimerWrapper = styled.div`
  padding: 10vh 0 7vh;
  font-size: 30px;
  color: #fff;
`;

const defaultMaterialTheme = createMuiTheme({
  typography: {
    fontFamily: ['Circular', 'Helvetica', 'Arial', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      main: '#1db954',
    },
  },
  overrides: {
    MuiInputBase: {
      input: {
        color: '#fff',
        textAlign: 'center',
        fontSize: '50px',
        padding: '6px 0 15px',
      },
    },
    MuiInput: {
      root: {
        width: '75%',
        margin: '0 auto',
      },
      underline: {
        '&:before': {
          borderBottom: '1px solid rgba(255, 255, 255, 0.42)',
        },
      },
    },
  },
});
