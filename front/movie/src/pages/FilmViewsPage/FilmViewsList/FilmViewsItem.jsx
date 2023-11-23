import React from 'react'
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DeleteConfirmationModal } from '../../../components/DeleteConfirmationModal';
import extractTimeFromDate from '../../../convertDate';

export default function FilmViewsItem({filmView, fetchFilmViews, onDelete, onEdit}) {
    const {
        id,
        film,
        hall,
        startTime } = filmView;
      const [showDeleteModal, setShowDeleteModal] = useState(false);
      const navigate = useNavigate();
      
  const handleRemoveClick = () => {
    setShowDeleteModal(true);
  };

  const handleEditClick = () => {
    handleShowEditModal();
  }

  const handleShowEditModal = () => {
    onEdit(filmView);
  }

  const handleConfirmDelete = () => {
    onDelete(id);
    setShowDeleteModal(false);
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h3 className="card-title">{film?.title}</h3>
        <div className="row">
          <div className="col">  
        <p className="card-text">Genre: {film?.genre}</p>
        <p className="card-text">Duration: {film?.durationMinutes} minutes</p>
        <p className="card-text">Start time: {extractTimeFromDate(startTime)}</p>
        <p className="card-text">Cinema: {hall?.cinema?.name}</p>
        <p className="card-text">Hall: {hall?.name}</p>
        <Button variant="primary" onClick={() => navigate(`/cinema/${hall?.cinemaId}`)}>
          Open cinema
        </Button>
        <Button style={{marginLeft: 20}} variant="danger" onClick={handleRemoveClick}>
          Remove
        </Button>
        <Button style={{marginLeft: 20}} variant="warning" onClick={handleEditClick}>
          Edit
        </Button>
        <DeleteConfirmationModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirmDelete={handleConfirmDelete}
        />
          </div>
          <div className="col d-flex justify-content-end">
            <div style={{position: 'relative', width: 200, paddingBottom: '56%'}}>
              <img style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'}} src={`data:image/jpeg;base64,${film?.poster}`} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
