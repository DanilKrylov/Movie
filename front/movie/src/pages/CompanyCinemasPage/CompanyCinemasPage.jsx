import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { $authHost, $host } from '../../http/httpService';
import { Context } from '../..';

const CinemaItem = ({ cinema }) => {
    const { name, location, description, halls } = cinema;

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h3 className="card-title">{name}</h3>
                <p className="card-text">Location: {location}</p>
                <p className="card-text">Description: {description}</p>
                <p className="card-text">Hall Count: {halls.length}</p>
            </div>
        </div>
    );
};

const CinemaList = ({ cinemas }) => {
    return (
        <div className="container mt-4">
            <h2>List of Cinemas</h2>
            {cinemas.map((cinema) => (
                <CinemaItem key={cinema.Id} cinema={cinema} />
            ))}
        </div>
    );
};

export const CompanyCinemasPage = () => {
    const [cinemas, setCinemas] = useState([])
    const {userSession} = useContext(Context)

    useEffect(() => {
        console.log($authHost.get("Cinemas/forCompany"))
    })

    return (
        <div><CinemaList
            cinemas={cinemas}
        ></CinemaList></div>
    )
}


