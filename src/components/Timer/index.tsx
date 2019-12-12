import React, { useState } from 'react';
import styled from 'styled-components';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import toggleScrollEvent from '../../util/functions/toggleScrollEvent';

interface Props {
  setHour: React.Dispatch<React.SetStateAction<string>>;
  setMinute: React.Dispatch<React.SetStateAction<string>>;
}

const Timer: React.FC<Props> = (props) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const onChange = (date: MaterialUiPickersDate) => {
    setDate(date as Date);
  };

  const onOpen = () => {
    toggleScrollEvent(true);
  };
  const onClose = () => {
    toggleScrollEvent(false);
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 200);
  };

  const setDate = (date: Date) => {
    setSelectedDate(date);
    props.setHour(date.getHours().toString());
    props.setMinute(date.getMinutes().toString());
  };

  return (
    <TimerWrapper className="Timer">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <ThemeProvider theme={defaultMaterialTheme}>
          <TimePicker
            value={selectedDate}
            onChange={onChange}
            onOpen={onOpen}
            onClose={onClose}
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
