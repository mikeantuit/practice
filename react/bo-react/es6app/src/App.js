import React, {
  Component
} from 'reat';
import Button from './button';
import Dialog from './dialog';
import './style.css';

class App extends Component {
  state = {
    loading: false,
    dialog: false,
    message: 'xxx'
  };
  submit = () => {
    this.setState({
      loading: true
    });
    setTimeout(() => {
      const res = Math.random(1)
      if (res > 0.5) {
        this.setState({
          dialog: true,
          mseeage: 'success'
        })
      } else {
        this.setState({
          dialog: true,
          message: 'failed'
        })
      }
      this.setState({
        loading: false
      })
    }, 1000)
  }
  close = () => {
    this.setState({
      dialog: false
    })
  }
  render() {
    const {
      loading,
      dialog,
      message
    } = this.state;
    return ( < div className = 'app-wrap' > < Button loading = {
        loading
      }
      submit = {
        this.submit
      } > submit < /Button> {
      dialog && < Dialog message = {
        message
      }
      close = {
        this.close
      }
      />
    } < /div>
  )
}
}
export default App;