import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { $authHost, $host } from "../../http/httpService";
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
    setSelectedSeats([])
    setGridSize(parseInt(e.target.value, 10));
  };

  const handleAddHall = () => {
    handleCreateHall()
  };

  const handleCloseDeleteModal = () => {
    setHallToDelete(null);
    setShowDeleteModal(false);
  };

  const handleSeatClick = (rowNumber, seatNumber) => {
    const isSeatSelected = selectedSeats.some(
      (s) => s.rowNumber === rowNumber && s.seatNumber === seatNumber
    );

    if (isSeatSelected) {
      setSelectedSeats(
        selectedSeats.filter((s) => !(s.rowNumber === rowNumber && s.seatNumber === seatNumber))
      );
    } else {
      setSelectedSeats([...selectedSeats, { rowNumber, seatNumber }]);
    }
  };

  console.log(selectedSeats)

  const handleCreateHall = () => {
    const hallData = {
      name: hallName,
      cinemaId: id,
      seats: selectedSeats,
      gridSize: gridSize
    };

    $host.post('halls', hallData)

    handleCloseAddModal();
    setSelectedSeats([]);
    setHallName("");
  };

  const handleDeleteHall = () => {
    if (hallToDelete) {
      handleCloseDeleteModal();
    }
  };

  if (!cinema) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <NavBar></NavBar>
      <div className="container mt-4">
        <div className="container">
          <div className="card">
            <div className="container-fliud">
              <div className="wrapper row">
                <div className="preview col-md-6">

                  <div className="preview-pic tab-content">
                    <div className="tab-pane active" id="pic-1"><img src={"data:image/png;base64," + cinema.logo} /></div>
                  </div>
                </div>
                <div className="details col-md-6">
                  <h3 className="product-title">{cinema.name}</h3>
                  <h4 className="price">Location: {cinema.location}</h4>
                  <p className="product-description">{cinema.description}</p>



                  <Button className="m-2" variant="primary" onClick={handleShowAddModal}>
                    Add Hall
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {cinema.halls?.map(hall => (
          <div className="container">
            <div className="card">
              <div className="container-fliud">
                  <h3 className="product-title">{hall.name}</h3>
                  <div
                    style={{ width: `${10 * (gridSize - 1) + 40 * gridSize}px` }}
                    className="seat-grid"
                  >
                    {Array.from({ length: gridSize }).map((_, row) =>
                      Array.from({ length: gridSize }).map((_, seat) => {
                        const isSeatSelected = hall.seats.some(
                          (s) => s.rowNumber === row && s.seatNumber === seat
                        );
                        return (
                          <div
                            key={`seat-${seat}`}
                            style={!isSeatSelected ? {} : {}}
                            className={`seat ${isSeatSelected ? "selected" : ""}`}
                            onClick={() => handleSeatClick(row, seat)}
                          >
                            {row + 1}-{seat + 1}
                          </div>
                        );
                      })
                    )}
                  </div>
                  {console.log(hall)}
                </div>
              </div>
          </div>
        ))}

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
                  required
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
                        (s) => s.rowNumber === row && s.seatNumber === seat
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
