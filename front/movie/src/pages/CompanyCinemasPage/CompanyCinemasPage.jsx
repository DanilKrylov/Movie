import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { $authHost, $host } from "../../http/httpService";
import { Context } from "../..";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/NavBar";
import { CinemaItem } from "./CinemaItem";
import './cinemaPage.css'

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

// const DeleteConfirmationModal = ({ show, onHide, onConfirmDelete }) => {
//   return (
//     <Modal show={show} onHide={onHide}>
//       <Modal.Header closeButton>
//         <Modal.Title>Confirm Deletion</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>Are you sure you want to delete this cinema?</Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide}>
//           Cancel
//         </Button>
//         <Button variant="danger" onClick={onConfirmDelete}>
//           Delete
//         </Button>
//       </Modal.Footer>
//     </Modal>
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
  const { userSession } = useContext(Context);
  const { handleSubmit, control, formState, setError, reset } = useForm();
  const { errors } = formState;
  const [file, setFile] = useState();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    data.companyLogin = userSession.user.login;

    const formData = new FormData();

    formData.append(
      "Logo",
      file
    );

    formData.append(
      "Name",
      data.name
    );

    formData.append(
      "location",
      data.location
    );

    formData.append(
      "description",
      data.description
    );

    formData.append(
      "companyLogin",
      data.companyLogin
    );

    await $authHost.post('Cinemas', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });


    handleCloseCreateModal()
    $authHost.get("Cinemas/forCompany").then((response) => {
      console.log(response.data);
      setCinemas(response.data);
    });
  };

  const onDelete = async (id) => {
    setCinemas(cinemas.filter((c) => c.id !== id));
    $host.delete("Cinemas/" + id);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    reset()
  }
  const handleShowCreateModal = () => setShowCreateModal(true);

  useEffect(() => {
    $authHost.get("Cinemas/forCompany").then((response) => {
      console.log(response.data);
      setCinemas(response.data);
    });
  }, []);

  return (
    <>
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
            <Form.Group controlId="logo" className="mb-3">
              <Form.Label>Logo</Form.Label>
              <Form.Control
                      type="file"
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

      <section className="section-products">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-md-8 col-lg-6">
              <div className="header">
                <h3>Company Cinemas</h3>
                
              <Button
            variant="primary"
            onClick={handleShowCreateModal}
            className="mb-4"
          >
            Create Cinema
          </Button>
              </div>
            </div>
          </div>
          <div className="row">
            {cinemas.map(cinema => (
              <CinemaItem key={cinema.id} cinema={cinema}></CinemaItem>
            ))}
          </div>
        </div>
      </section>
    </>
    // <div>
    //   <div className="container mt-4">
    //     <div className="p-4">

    //       <CinemaList onDelete={onDelete} cinemas={cinemas} />

    //       
    //     </div>
    //   </div>
    // </div>
  );
};
