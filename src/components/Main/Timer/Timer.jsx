import React, { Component } from 'react';
import './Timer.scss';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import lime from '@material-ui/core/colors/lime';
import { toggleScroll } from '../../../helper/util';
export default class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
    };
    this.defaultMaterialTheme = createMuiTheme({
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
  }
  handleDateChange(date) {
    this.setState({ selectedDate: date });
    this.props.onChangeHour(date.getHours());
    this.props.onChangeMinute(date.getMinutes());
  }

  render() {
    return (
      <div className="Timer">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <ThemeProvider theme={this.defaultMaterialTheme}>
            <TimePicker
              value={this.state.selectedDate}
              onChange={e => this.handleDateChange(e)}
              onOpen={() => {
                toggleScroll({ fix: true });
              }}
              onClose={() => {
                toggleScroll({ fix: false });
                setTimeout(() => {
                  document.activeElement.blur();
                }, 200);
              }}
            />
          </ThemeProvider>
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}
