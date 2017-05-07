import React from 'react';

import constants from '../../../core/shared/constants';

export default function Message(props) {
    let date = new Date(props.time);
    console.log(date);
    return (
        <div style={{color:props.type === constants.chat.USER_MESSAGE ? 'black' : 'red'}}>
            <span>{date.getHours() + " : " +  date.getMinutes()}</span>
            <a href={"/profile/" + props.user}>{props.user}</a>
            {props.content}
        </div>
    )
}