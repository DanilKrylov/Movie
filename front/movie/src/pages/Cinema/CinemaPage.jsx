import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { $authHost } from "../../http/httpService";
import { NavBar } from "../../components/NavBar";
import "./CinemaPage.css";

const CinemaPage = () => {
  const { id } = useParams();
  const [cinema, setCinema] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHallName, setNewHallName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hallToDelete, setHallToDelete] = useState(null);
  const [gridSize, setGridSize] = useState(5); // Default grid size
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [hallName, setHallName] = useState("");

  useEffect(() => {
    // Fetch data about the cinema and its halls using the cinema ID
    $authHost.get("Cinemas/" + id).then((response) => {
      setCinema(response.data);
    });
  }, [id]);

  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleGridSizeChange = (e) => {
    setGridSize(parseInt(e.target.value, 10));
  };

  const handleAddHall = () => {
    handleCloseAddModal();
  };

  const handleShowDeleteModal = (hall) => {
    setHallToDelete(hall);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setHallToDelete(null);
    setShowDeleteModal(false);
  };

  const handleSeatClick = (row, seat) => {
    const isSeatSelected = selectedSeats.some(
      (s) => s.row === row && s.seat === seat
    );

    if (isSeatSelected) {
      setSelectedSeats(
        selectedSeats.filter((s) => !(s.row === row && s.seat === seat))
      );
    } else {
      setSelectedSeats([...selectedSeats, { row, seat }]);
    }
  };

  const handleCreateHall = () => {
    const hallData = {
      name: hallName,
      cinemaId: id, // Assuming you have the cinema id in scope
      seats: selectedSeats,
    };

    // Implement logic to create the hall with seat data
    // Example: $authHost.post("Halls", hallData).then(...)

    // Close the modal and reset the form
    handleCloseAddModal();
    setSelectedSeats([]);
    setHallName("");
  };

  const handleDeleteHall = () => {
    if (hallToDelete) {
      // Implement hall deletion logic here
      // After deleting the hall, you can fetch the updated cinema data if needed
      // Example: $authHost.delete("Halls/" + hallToDelete.id).then(...)
      // Then update the state with the new data
      // Finally, close the modal
      handleCloseDeleteModal();
    }
  };

  if (!cinema) {
    // Handle loading or error state
    return <p>Loading...</p>;
  }

  return (
    <div>
      <NavBar></NavBar>
      <div className="container mt-4">
        <h2>{cinema.name}</h2>
        <p>Location: {cinema.location}</p>
        <p>Description: {cinema.description}</p>
        <h3>Halls</h3>
        {cinema.halls.map((hall) => (
          <div key={hall.id} className="card mb-3">
            <div className="card-body">
              <h4 className="card-title">{hall.name}</h4>
              {/* Add hall details here */}
              <Button
                className="m-1"
                variant="danger"
                onClick={() => handleShowDeleteModal(hall)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
        <Button className="m-1" variant="primary" onClick={handleShowAddModal}>
          Add Hall
        </Button>

        <Modal
          dialogClassName={gridSize >= 10 && "modal-content-10"}
          show={showAddModal}
          onHide={handleCloseAddModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Hall</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Form.Group controlId="hallName" className="mb-3">
                <Form.Label>Hall Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter hall name"
                  value={hallName}
                  onChange={(e) => setHallName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="gridSize" className="mb-3">
                <Form.Label>Grid Size</Form.Label>
                <Form.Control
                  as="select"
                  value={gridSize}
                  onChange={handleGridSizeChange}
                >
                  {Array.from({ length: 16 }, (_, index) => (
                    <option key={index} value={index + 5}>
                      {index + 5}x{index + 5}
                    </option>
                  ))}
                  {/* Add more grid size options */}
                </Form.Control>
              </Form.Group>
              <div className="gridWrapper">
                <div
                  style={{ width: `${10 * (gridSize - 1) + 40 * gridSize}px` }}
                  className="seat-grid"
                >
                  {Array.from({ length: gridSize }).map((_, row) =>
                    Array.from({ length: gridSize }).map((_, seat) => {
                      const isSeatSelected = selectedSeats.some(
                        (s) => s.row === row && s.seat === seat
                      );
                      return (
                        <div
                          key={`seat-${seat}`}
                          className={`seat ${isSeatSelected ? "selected" : ""}`}
                          onClick={() => handleSeatClick(row, seat)}
                        >
                          {row + 1}-{seat + 1}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddHall}>
              Add Hall
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this hall?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteHall}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default CinemaPage;
