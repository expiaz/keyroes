import React from 'react';

import constants from '../../../core/shared/constants';

export default function Message(props) {
    let date = new Date(props.time);
    return (
        <div style={{color:props.type === constants.chat.USER_MESSAGE ? 'black' : 'red'}}>
            <strong>{date.getHours() + ":" +  date.getMinutes()} - <a href={"/profile/" + props.user}>{props.user}</a> : </strong>
            {props.content}
        </div>
    )
}