import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { $authHost, $host } from "../../http/httpService";
import { Context } from "../..";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/NavBar";

const FilmItem = ({ film, onDelete }) => {
  const {
    id,
    title,
    director,
    description,
    releaseYear,
    genre,
    durationMinutes,
  } = film;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleRemoveClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(id);
    setShowDeleteModal(false);
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-text">Director: {director}</p>
        <p className="card-text">Description: {description}</p>
        <p className="card-text">Release Year: {releaseYear}</p>
        <p className="card-text">Genre: {genre}</p>
        <p className="card-text">Duration: {durationMinutes} minutes</p>
        <Button variant="danger" onClick={handleRemoveClick}>
          Remove
        </Button>
        <DeleteConfirmationModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirmDelete={handleConfirmDelete}
        />
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ show, onHide, onConfirmDelete }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this film?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirmDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const FilmList = ({ films, onDelete }) => {
  if (films.length === 0) {
    return <p>No films available.</p>;
  }

  return (
    <>
      <h2>List of Films</h2>
      {films.map((film) => (
        <FilmItem key={film.Id} onDelete={onDelete} film={film} />
      ))}
    </>
  );
};

export const FilmsPage = () => {
  const [films, setFilms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { userSession } = useContext(Context);
  const { handleSubmit, control, formState, setError } = useForm();
  const { errors } = formState;
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    await $host.post("Films", data);
    handleCloseCreateModal();

    // Refresh the film list
    await fetchFilms();
  };

  const onDelete = async (id) => {
    setFilms(films.filter((film) => film.id !== id));
    await $host.delete(`Films/${id}`);
  };

  const handleCloseCreateModal = () => setShowCreateModal(false);
  const handleShowCreateModal = () => setShowCreateModal(true);

  const fetchFilms = async () => {
    const response = await $host.get("Films");
    setFilms(response.data);
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  return (
    <div>
      <NavBar></NavBar>
      <div className="container mt-4">
        <div className="p-4">
          <Button
            variant="primary"
            onClick={handleShowCreateModal}
            className="mb-4"
          >
            Create Film
          </Button>

          <FilmList onDelete={onDelete} films={films} />

          <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
            <Modal.Header closeButton>
              <Modal.Title>Create Film</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="title" className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Controller
                    name="title"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Title is required",
                    }}
                    render={({ field }) => (
                      <>
                        <Form.Control
                          type="text"
                          placeholder="Enter title"
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

                <Form.Group controlId="director" className="mb-3">
                  <Form.Label>Director</Form.Label>
                  <Controller
                    name="director"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Director is required",
                    }}
                    render={({ field }) => (
                      <>
                        <Form.Control
                          type="text"
                          placeholder="Enter director"
                          {...field}
                          isInvalid={!!errors?.director}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors?.director?.message}
                        </Form.Control.Feedback>
                      </>
                    )}
                  />
                </Form.Group>

                <Form.Group controlId="description" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Controller
                    name="description"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Form.Control
                        as="textarea"
                        placeholder="Enter description"
                        {...field}
                      />
                    )}
                  />
                </Form.Group>

                <Form.Group controlId="releaseYear" className="mb-3">
                  <Form.Label>Release Year</Form.Label>
                  <Controller
                    name="releaseYear"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Release Year is required",
                      pattern: {
                        value: /^[0-9]{4}$/,
                        message: "Invalid Release Year format (e.g., 2022)",
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <Form.Control
                          type="text"
                          placeholder="Enter Release Year (e.g., 2022)"
                          {...field}
                          isInvalid={!!errors?.releaseYear}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors?.releaseYear?.message}
                        </Form.Control.Feedback>
                      </>
                    )}
                  />
                </Form.Group>

                <Form.Group controlId="genre" className="mb-3">
                  <Form.Label>Genre</Form.Label>
                  <Controller
                    name="genre"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Genre is required",
                    }}
                    render={({ field }) => (
                      <>
                        <Form.Control
                          type="text"
                          placeholder="Enter genre"
                          {...field}
                          isInvalid={!!errors?.genre}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors?.genre?.message}
                        </Form.Control.Feedback>
                      </>
                    )}
                  />
                </Form.Group>

                <Form.Group controlId="durationMinutes" className="mb-3">
                  <Form.Label>Duration (Minutes)</Form.Label>
                  <Controller
                    name="durationMinutes"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Duration (Minutes) is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Invalid Duration format (e.g., 120)",
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <Form.Control
                          type="text"
                          placeholder="Enter Duration (e.g., 120)"
                          {...field}
                          isInvalid={!!errors?.durationMinutes}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors?.durationMinutes?.message}
                        </Form.Control.Feedback>
                      </>
                    )}
                  />
                </Form.Group>

                <div className="text-center">
                  <Button
                    variant="primary"
                    type="submit"
                    style={{ width: "100%" }}
                  >
                    Create Film
                  </Button>
                </div>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseCreateModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};
