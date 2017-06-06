import React from 'react';

export default function SpectateTiles(props) {
    return (
        <div className="col-md-4">
            players: {props.players.map((e) => <span key={e.username+e.score}>{e.username} : {e.score}</span>)}
            <a href={"/games/" + props.id}>Regarder</a>
        </div>
    );
}

