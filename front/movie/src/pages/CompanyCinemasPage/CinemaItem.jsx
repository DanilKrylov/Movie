import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faRemove, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export const CinemaItem = ({cinema}) => {
    return (
        <div className="col-md-6 col-lg-4 col-xl-3">
            <div id="product-1" className="single-product">
                <div className="part-1" style={{backgroundImage: "url(data:image/png;base64," + cinema.logo + ")"}}>
                    <ul>
                        <li><a href="#"><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></a></li>
                        <li><a href="#"><FontAwesomeIcon icon={faRemove}></FontAwesomeIcon></a></li>
                        <li><a href="#"><FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon></a></li>
                    </ul>
                </div>
                <div className="part-2">
                    <h3 className="product-title">{cinema.name}</h3>
                </div>
            </div>
        </div>
    )
}
