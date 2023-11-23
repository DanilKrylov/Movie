import React from 'react'
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import extractTimeFromDate from '../../../convertDate';
import { $host } from '../../../http/httpService';
import FilmViewsItem from './FilmViewsItem';

export default function FilmViewsList({ filmViews, onDelete, fetchFilmViews, getHalls, getFilms}) {
  const [editFilmView, setEditFilmView] = useState();
  const { handleSubmit, control, formState, setError } = useForm();
  const [showEditModal, setShowEditModal] = useState(false);
  const [halls, setHalls] = useState();
  const [films, setFilms] = useState();
  const { errors } = formState;
  
  const handleShowEditModal = async () => {
    setHalls(await getHalls());
    setFilms(await getFilms());
    setShowEditModal(true);
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  }

  const onEdit = (filmView) => {
    const {
      id,
      filmId,
      hallId,
      startTime
    } = filmView;
    setEditFilmView({filmId, hallId, startTime, id});
    handleShowEditModal();
  }
    
  const onSubmitEdit = async (data) => {
    await $host.put(`FilmViews/${editFilmView?.id}`, {...data, id: editFilmView?.id});

    handleCloseEditModal();

    await fetchFilmViews();
  }

  if (filmViews?.length === 0) {
    return <p>No films available.</p>;
  }

  return (
    <div>
      <h2>List of Film views</h2>
      {filmViews?.map((filmView) => (
        <FilmViewsItem key={filmView.id} onDelete={onDelete} onEdit={onEdit} filmView={filmView} fetchFilmViews={fetchFilmViews}/>
      ))}

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
            <Modal.Header closeButton>
              <Modal.Title>Edit film view</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmitEdit)}>

            <Form.Group controlId="startTime" className="mb-3">
                  <Form.Label>Start time</Form.Label>
                  <Controller
                    name="startTime"
                    control={control}
                    defaultValue={extractTimeFromDate(editFilmView?.startTime)}
                    rules={{
                      required: "Time is required",
                    }}
                    render={({ field }) => (
                      <>
                        <Form.Control
                          type="time"
                          placeholder="Enter time"
                          {...field}
                          isInvalid={!!errors?.title}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors?.title?.message}
                        </Form.Control.Feedback>
                      </>
                    )}
                  />
                </Form.Group>

                <Form.Group controlId="hallId" className="mb-3">
        <Form.Label>Hall</Form.Label>
        <Controller
          name="hallId"
          control={control}
          defaultValue={editFilmView?.hallId}
          render={({ field }) => (
            <select {...field} className="form-control">
              {halls?.map((hall) => (
                <option key={hall.id} value={hall.id}>
                  {hall.name}
                </option>
              ))}
            </select>
          )}
        />
      </Form.Group>

      <Form.Group controlId="filmId" className="mb-3">
        <Form.Label>Film</Form.Label>
        <Controller
          name="filmId"
          control={control}
          defaultValue={editFilmView?.filmId}
          render={({ field }) => (
            <select {...field} className="form-control">
              {films?.map((film) => (
                <option key={film.id} value={film.id}>
                  {film.title}
                </option>
              ))}
            </select>
          )}
        />
      </Form.Group>

                <div className="text-center">
                  <Button
                    variant="primary"
                    type="submit"
                    style={{ width: "100%" }}
                  >
                    Edit film view
                  </Button>
                </div>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEditModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
    </div>
  );
}