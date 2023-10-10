import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { $authHost, $host } from "../../http/httpService";
import { Context } from "../..";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/NavBar";

const CinemaItem = ({ cinema, onDelete }) => {
  const { id, name, location, description, halls } = cinema;
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
        <h3 className="card-title">{name}</h3>
        <p className="card-text">Location: {location}</p>
        <p className="card-text">Description: {description}</p>
        <p className="card-text">Hall Count: {halls.length}</p>
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
      <Modal.Body>Are you sure you want to delete this cinema?</Modal.Body>
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

const CinemaList = ({ cinemas, onDelete }) => {
  if (cinemas.length === 0) {
    return <p>No cinemas available.</p>;
  }

  return (
    <>
      <h2>List of Cinemas</h2>
      {cinemas.map((cinema) => (
        <CinemaItem key={cinema.Id} onDelete={onDelete} cinema={cinema} />
      ))}
    </>
  );
};

export const CompanyCinemasPage = () => {
  const [cinemas, setCinemas] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { userSession } = useContext(Context);
  const { handleSubmit, control, formState, setError } = useForm();
  const { errors } = formState;
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    handleCloseCreateModal()
    data.companyLogin = userSession.user.login;
    console.log(data);
    await $host.post("Cinemas", data);

    $authHost.get("Cinemas/forCompany").then((response) => {
      console.log(response.data);
      setCinemas(response.data);
    });
  };

  const onDelete = async (id) => {
    setCinemas(cinemas.filter((c) => c.id !== id));
    $host.delete("Cinemas/" + id);
  };

  const handleCloseCreateModal = () => setShowCreateModal(false);
  const handleShowCreateModal = () => setShowCreateModal(true);

  useEffect(() => {
    $authHost.get("Cinemas/forCompany").then((response) => {
      console.log(response.data);
      setCinemas(response.data);
    });
  }, []);

  return (
    <div>
      <div className="container mt-4">
        <div className="p-4">
          <Button
            variant="primary"
            onClick={handleShowCreateModal}
            className="mb-4"
          >
            Create Cinema
          </Button>

          <CinemaList onDelete={onDelete} cinemas={cinemas} />

          <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
            <Modal.Header closeButton>
              <Modal.Title>Create Cinema</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="name" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Name is required",
                    }}
                    render={({ field }) => (
                      <>
                        <Form.Control
                          type="text"
                          placeholder="Enter name"
                          {...field}
                          isInvalid={!!errors?.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors?.name?.message}
                        </Form.Control.Feedback>
                      </>
                    )}
                  />
                </Form.Group>

                <Form.Group controlId="location" className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Controller
                    name="location"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Location is required",
                    }}
                    render={({ field }) => (
                      <>
                        <Form.Control
                          type="text"
                          placeholder="Enter location"
                          {...field}
                          isInvalid={!!errors?.location}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors?.location?.message}
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

                <div className="text-center">
                  <Button
                    variant="primary"
                    type="submit"
                    style={{ width: "100%" }}
                  >
                    Create Cinema
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
