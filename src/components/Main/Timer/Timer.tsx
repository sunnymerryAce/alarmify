import React from 'react';
import styled from 'styled-components';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import toggleScrollEvent from '../../../util/functions/toggleScrollEvent';

interface Props {
  onChangeHour: Function;
  onChangeMinute: Function;
}
interface State {
  selectedDate: Date;
}
export default class Timer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
    };
  }
  handleDateChange(date: any) {
    this.setState({ selectedDate: date });
    this.props.onChangeHour(date.getHours());
    this.props.onChangeMinute(date.getMinutes());
  }

  render() {
    return (
      <TimerDiv className="Timer">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <ThemeProvider theme={defaultMaterialTheme}>
            <TimePicker
              value={this.state.selectedDate}
              onChange={(e) => this.handleDateChange(e)}
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
      </TimerDiv>
    );
  }
}

const TimerDiv = styled.div`
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
