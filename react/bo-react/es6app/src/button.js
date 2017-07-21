import React from 'react';
const Button = (props) => {
    const {children, loading, submit} = props;
    return (< button onClick = {
        submit
    }
    diabled = {
        loading
            ? 'diabled'
            : null
    } > {
        loading && < i className = 'loading' > < /i>} {
            children
        } <
        /button >);};
    export default Button;