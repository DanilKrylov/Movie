import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { $authHost, $host } from "../../http/httpService";
import { Context } from "../..";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/NavBar";
import { SearchBar } from "../CompanyCinemasPage/SearchBar";
import { useMemo } from "react";

const FilmItem = ({ film, onDelete, fetchFilms}) => {
  const {
    id,
    title,
    director,
    description,
    releaseYear,
    genre,
    durationMinutes,
    poster
  } = film;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  
  const [showEditModal, setShowEditModal] = useState(false);
  const [file, setFile] = useState([]);
  const { handleSubmit, control, formState, setError} = useForm({defaultValues: {
    title: film.title,
    director: film.director,
    description: film.description,
    releaseYear: film.releaseYear,
    genre: film.genre,
    durationMinutes: film.durationMinutes,
  }});
  const { errors } = formState;
  
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = () => setShowEditModal(true);

  const handleRemoveClick = () => {
    setShowDeleteModal(true);
  };

  const handleEditClick = () => {
    handleShowEditModal();
  }

  const handleConfirmDelete = () => {
    onDelete(id);
    setShowDeleteModal(false);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("Id", id);

    formData.append("Title", data.title);

    formData.append("Director", data.director);

    formData.append("Description", data.description);

    formData.append("ReleaseYear", data.releaseYear);
    formData.append("genre", data.genre);
    formData.append("durationMinutes", data.durationMinutes);

    formData.append("poster", data.poster);

    await $host.put(`Films/${id}`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    handleCloseEditModal();

    // Refresh the film list
    await fetchFilms();
  };

  return (
      <div className="card mb-3">
      <div className="card-body">

    {/* Modal */}
    <Modal show={showEditModal} onHide={handleCloseEditModal}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Film</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="title" className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Controller
                    name="title"
                    control={control}
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
                <Form.Group controlId="poster" className="mb-3">
              <Form.Label>Poster</Form.Label>
              <Controller
    name="poster"
    control={control}
    rules={{
      required: "Poster is required"
    }}
    render={({ field }) => (
      <>
        <Form.Control
          type="file"
          placeholder="Poster"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            const file1 = e.target.files[0];
            setFile(file1); // Устанавливаем выбранный файл через useState
            field.onChange(file1); // Обновляем значение поля формы для передачи данных в Controller
          }}
          isInvalid={!!errors?.poster}
        />
        <Form.Control.Feedback type="invalid">
          {errors?.poster?.message}
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
              <Button variant="secondary" onClick={handleCloseEditModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          

        <h3 className="card-title">{title}</h3>
        <div className="row">
          <div className="col">  
        <p className="card-text">Director: {director}</p>
        <p className="card-text">Description: {description}</p>
        <p className="card-text">Release Year: {releaseYear}</p>
        <p className="card-text">Genre: {genre}</p>
        <p className="card-text">Duration: {durationMinutes} minutes</p>
        <Button variant="danger" onClick={handleRemoveClick}>
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
              <img style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'}} src={`data:image/jpeg;base64,${poster}`} alt="" />
            </div>
          </div>
        </div>
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

const FilmList = ({ films, onDelete, fetchFilms}) => {
  if (films.length === 0) {
    return <p>No films available.</p>;
  }

  return (
    <>
      <h2>List of Films</h2>
      {films.map((film) => (
        <FilmItem key={film.Id} onDelete={onDelete} film={film} fetchFilms={fetchFilms}/>
      ))}
    </>
  );
};

export const FilmsPage = () => {
  const [films, setFilms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [file, setFile] = useState([]);
  const [searchString, setSearchString] = useState("")
  const { userSession } = useContext(Context);
  const { handleSubmit, control, formState, setError } = useForm();
  const { errors } = formState;
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("Title", data.title);

    formData.append("Director", data.director);

    formData.append("Description", data.description);

    formData.append("ReleaseYear", data.releaseYear);
    formData.append("genre", data.genre);
    formData.append("durationMinutes", data.durationMinutes);

    formData.append("poster", data.poster);

    await $host.post("Films", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
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

  const filteredFilms = useMemo(() => {
    return films.filter(c => !searchString ||
      c.title.includes(searchString) ||
      c.director.includes(searchString) ||
      c.description.includes(searchString) ||
      c.genre.includes(searchString))
  }, [searchString, films])

  useEffect(() => {
    fetchFilms();
  }, []);

  return (
    <div>
      <NavBar></NavBar>
      <div className="container mt-4">
        <div className="p-4">
          
          <SearchBar setSearchString={setSearchString} handleShowCreateModal={handleShowCreateModal}></SearchBar>
          <FilmList onDelete={onDelete} films={filteredFilms} fetchFilms={fetchFilms} />

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
                <Form.Group controlId="poster" className="mb-3">
              <Form.Label>Poster</Form.Label>
              <Controller
    name="poster"
    control={control}
    rules={{
      required: "Poster is required"
    }}
    render={({ field }) => (
      <>
        <Form.Control
          type="file"
          placeholder="Poster"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            const file1 = e.target.files[0];
            setFile(file1); // Устанавливаем выбранный файл через useState
            field.onChange(file1); // Обновляем значение поля формы для передачи данных в Controller
          }}
          isInvalid={!!errors?.poster}
        />
        <Form.Control.Feedback type="invalid">
          {errors?.poster?.message}
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
