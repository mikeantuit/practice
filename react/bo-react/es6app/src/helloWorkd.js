import React, {Component} from 'react';

class HelloWorld extends Component {
    clickHander = () => {
        console.log(this.refs)
    }

    refCallback = (elem) => {
        console.log(elem);
    }

    render() {
        return ( < div className = "container" onClick = {
            this.clickHander
        } > < div ref = "hello" className = "hello" > Hello < /div> <
            div ref = {
                this.refCallback
            }
            className = "world" > World < /div > < /div>
        )
    }
}
export default HelloWorld;