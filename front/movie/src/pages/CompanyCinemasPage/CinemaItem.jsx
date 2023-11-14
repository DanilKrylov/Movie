import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faRemove, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import './searchBar.css'

export const CinemaItem = ({ cinema, handleRemoveClick, handleEditClick }) => {
    return (
        <div className='p-2'>
            <div id="product-1" className="single-product">
                <div>

                    <div className="part-1" style={{ backgroundImage: "url(data:image/png;base64," + cinema.logo + ")" }}>
                        <ul>
                            <li><a onClick={() => handleEditClick(cinema.id)}><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></a></li>
                            <li><a onClick={() => handleRemoveClick(cinema.id)}><FontAwesomeIcon icon={faRemove}></FontAwesomeIcon></a></li>
                            <li><Link to={"cinema/" + cinema.id}><FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon></Link></li>
                        </ul>
                    </div>
                    <div className="part-2">
                        <h3 className="product-title">{cinema.name}</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}
