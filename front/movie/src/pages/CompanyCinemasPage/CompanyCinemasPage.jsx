import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { $authHost, $host } from "../../http/httpService";
import { Context } from "../..";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/NavBar";
import { CinemaItem } from "./CinemaItem";
import "./cinemaPage.css";
import { DeleteConfirmationModal } from "../../components/DeleteConfirmationModal";
import { SearchBar } from "./SearchBar";

// const CinemaItem = ({ cinema, onDelete }) => {
//   const navigate = useNavigate();
//   const { id, name, location, description, halls } = cinema;
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   const handleRemoveClick = () => {
//     setShowDeleteModal(true);
//   };

//   const handleConfirmDelete = () => {
//     onDelete(id);
//     setShowDeleteModal(false);
//   };

//   return (
//     <div className="card mb-3">
//       <div className="card-body">
//         <h3 className="card-title">{name}</h3>
//         <p className="card-text">Location: {location}</p>
//         <p className="card-text">Description: {description}</p>
//         <p className="card-text">Hall Count: {halls.length}</p>
//         <Button className="m-1" variant="danger" onClick={handleRemoveClick}>
//           Remove
//         </Button>
//         <Button className="m-1" onClick={() => navigate("cinema/" + cinema.id)}>
//           More info
//         </Button>
//         <DeleteConfirmationModal
//           show={showDeleteModal}
//           onHide={() => setShowDeleteModal(false)}
//           onConfirmDelete={handleConfirmDelete}
//         />
//       </div>
//     </div>
//   );
// };

// const CinemaList = ({ cinemas, onDelete }) => {
//   if (cinemas.length === 0) {
//     return <p>No cinemas available.</p>;
//   }

//   return (
//     <>
//       <h2>List of Cinemas</h2>
//       {cinemas.map((cinema) => (
//         <CinemaItem key={cinema.Id} onDelete={onDelete} cinema={cinema} />
//       ))}
//     </>
//   );
// };

export const CompanyCinemasPage = () => {
  const [cinemas, setCinemas] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { userSession } = useContext(Context);
  const { handleSubmit, control, formState, setError, reset } = useForm();
  const { errors } = formState;
  const [file, setFile] = useState();
  const [currentId, setCurrentId] = useState();
  const [searchString, setSearchString] = useState("")

  const onSubmit = async (data) => {
    data.companyLogin = userSession.user.login;
    if(!file){
      return
    }

    const formData = new FormData();

    formData.append("Logo", file);

    formData.append("Name", data.name);

    formData.append("location", data.location);

    formData.append("description", data.description);

    formData.append("companyLogin", data.companyLogin);

    await $authHost.post("Cinemas", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    handleCloseCreateModal();
    $authHost.get("Cinemas/forCompany").then((response) => {
      console.log(response.data);
      setCinemas(response.data);
    });
  };

  const onEdit = async (data) => {
    if(!file){
      return
    }
    data.companyLogin = userSession.user.login;

    const formData = new FormData();
    formData.append("id", currentId);
    formData.append("Logo", file);
    formData.append("Name", data.name);
    formData.append("location", data.location);
    formData.append("description", data.description);
    formData.append("companyLogin", data.companyLogin);

    await $authHost.put("Cinemas", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    handleCloseEditModal();
    $authHost.get("Cinemas/forCompany").then((response) => {
      console.log(response.data);
      setCinemas(response.data);
    });
  };

  const onDelete = async () => {
    setShowDeleteModal(false);
    setCinemas(cinemas.filter((c) => c.id !== currentId));
    $host.delete("Cinemas/" + currentId);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    reset();
    setFile(null)
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    reset();
    setFile(null)
  };

  const handleShowCreateModal = () => setShowCreateModal(true);

  useEffect(() => {
    $authHost.get("Cinemas/forCompany").then((response) => {
      console.log(response.data);
      setCinemas(response.data);
    });
  }, []);

  const lastCinema = cinemas.find(c => c.id === currentId)
  const filteredCinemas = cinemas.filter(c => !searchString || c.name.includes(searchString) || c.location.includes(searchString) || c.description.includes(searchString))

  return (
    <>
      <DeleteConfirmationModal
        onConfirmDelete={onDelete}
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      ></DeleteConfirmationModal>
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
                rules={{
                  required: "Description is required",
                }}
                render={({ field }) => (
                  <Form.Control
                    as="textarea"
                    placeholder="Enter description"
                    {...field}
                  />
                )}
              />
            </Form.Group>
            <Form.Group controlId="logo" className="mb-3">
              <Form.Label>Logo</Form.Label>
              <Form.Control
                type="file"
                required
                accept="image/png, image/jpeg"
                placeholder="Logo"
                onChange={(e) => setFile(e.target.files[0])}
                isInvalid={!!errors?.logo}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.logo?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="text-center">
              <Button variant="primary" type="submit" style={{ width: "100%" }}>
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

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Cinema</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onEdit)}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Controller
                name="name"
                control={control}
                defaultValue={lastCinema?.name}
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
                defaultValue={lastCinema?.location}
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
                rules={{
                  required: "Description is required",
                }}
                defaultValue={lastCinema?.description}
                render={({ field }) => (
                  <Form.Control
                    as="textarea"
                    placeholder="Enter description"
                    {...field}
                  />
                )}
              />
            </Form.Group>
            <Form.Group controlId="logo" className="mb-3">
              <Form.Label>Logo</Form.Label>
              <Form.Control
                type="file"
                accept="image/png, image/jpeg"
                required
                placeholder="Logo"
                onChange={(e) => setFile(e.target.files[0])}
                isInvalid={!!errors?.logo}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.logo?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="text-center">
              <Button variant="primary" type="submit" style={{ width: "100%" }}>
                Edit Cinema
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
      <section className="section-products">
        <div className="container">
          <div className="row justify-content-center text-center">
          <SearchBar setSearchString={setSearchString} handleShowCreateModal={handleShowCreateModal}></SearchBar>
          </div>
          <div className="cinemas-list">
            {filteredCinemas.map((cinema) => (
              <CinemaItem
                handleEditClick={(id) => {
                  setShowEditModal(true);
                  setCurrentId(id);
                }}
                handleRemoveClick={(id) => {
                  setShowDeleteModal(true);
                  setCurrentId(id);
                }}
                key={cinema.id}
                cinema={cinema}
              ></CinemaItem>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
