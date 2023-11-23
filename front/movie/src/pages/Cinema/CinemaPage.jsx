import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { $authHost, $host } from "../../http/httpService";
import { NavBar } from "../../components/NavBar";
import "./CinemaPage.css";
import { Controller } from "react-hook-form";

const CinemaPage = () => {
  const { id } = useParams();
  const [cinema, setCinema] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHallName, setNewHallName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [hallToDelete, setHallToDelete] = useState(null);
  const [gridSize, setGridSize] = useState(5); // Default grid size
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [hallName, setHallName] = useState("");

  const [editHallName, setEditHallName] = useState("")
  const [editGridSize, setEditGridSize] = useState(0);
  const [editSelectedSeats, setEditSelectedSeats] = useState();
  const [editHallId, setEditHallId] = useState(null);

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

  const handleEditGridSizeChange = (e) => {
    setEditSelectedSeats([])
    setEditGridSize(parseInt(e.target.value, 10));
  };

  const handleAddHall = () => {
    handleCreateHall()
  };

  const handleEditHall = () => {
    const hallData = {
      id: editHallId,
      name: editHallName,
      cinemaId: id,
      seats: editSelectedSeats,
      gridSize: editGridSize
    };

    $host.put(`Halls/${hallData.id}`, hallData)

    handleCloseEditModal();
    setEditSelectedSeats([]);
    setEditHallName("");  
  };

  const handleCloseDeleteModal = () => {
    setHallToDelete(null);
    setShowDeleteModal(false);
  };

  const handleShowDeleteModal = (hall) => {
    setHallToDelete(hall);
    setShowDeleteModal(true);
  }

  const handleShowEditModal = (hall) => {
    setEditSelectedSeats(hall.seats)
    setEditGridSize(hall.gridSize)
    setEditHallName(hall.name);
    setEditHallId(hall.id)
    setShowEditModal(true);
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  }

  const handleSeatClick = (rowNumber, seatNumber, isVIP = false) => {
    const isSeatSelected = selectedSeats.some(
      (s) => s.rowNumber === rowNumber && s.seatNumber === seatNumber
    );

    if (isSeatSelected) {
      setSelectedSeats(
        selectedSeats.filter((s) => !(s.rowNumber === rowNumber && s.seatNumber === seatNumber))
      );
    } else {
      setSelectedSeats([...selectedSeats, { rowNumber, seatNumber, isVIP}]);
    }
  };

  console.log(selectedSeats)

  const handleEditSeatClick = (rowNumber, seatNumber, isVIP = false) => {
    const isSeatSelected = editSelectedSeats.some(
      (s) => s.rowNumber === rowNumber && s.seatNumber === seatNumber
    );

    if (isSeatSelected) {
      setEditSelectedSeats(
        editSelectedSeats.filter((s) => !(s.rowNumber === rowNumber && s.seatNumber === seatNumber))
      );
    } else {
      setEditSelectedSeats([...editSelectedSeats, { rowNumber, seatNumber, isVIP}]);
    }
  };

  console.log(selectedSeats);

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

  const handleDeleteHall = async () => {
    if (hallToDelete) {
      await $host.delete(`Halls/${hallToDelete.id}`);
      setCinema({...cinema, halls: cinema.halls.filter(c => c.id !== hallToDelete.id)})
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
              <div className="row">
                <div className="col">
                <div className="container-fliud">
                  <h3 className="product-title">{hall.name}</h3>
                  <div
                    style={{ width: `${10 * (hall.gridSize - 1) + 40 * hall.gridSize}px` }}
                    className="seat-grid"
                  >
                    {Array.from({ length: hall.gridSize }).map((_, row) =>
                      Array.from({ length: hall.gridSize }).map((_, seat) => {
                        const seatSelected = hall.seats.find(
                          (s) => s.rowNumber === row && s.seatNumber === seat
                        );
                        console.log(seatSelected)
                        return (
                          <div
                            key={`seat-${seat}`}
                            style={!seatSelected !== undefined ? {} : {}}
                            className={`seat ${seatSelected !== undefined ? (seatSelected?.isVIP ? "selectedVIP" : "selected") : ""}`}
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
                <div className="col d-flex justify-content-end">
                  <div>
                    <Button variant="danger" onClick={() => handleShowDeleteModal(hall)}>
                      Delete
                    </Button>

                    <Button style={{marginLeft: 20}} variant="warning" onClick={() => handleShowEditModal(hall)}>
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
              </div>
          </div>
        ))}

        {/* Add modal */}
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

                      const seatSelected = selectedSeats.find(
                        (s) => s.rowNumber === row && s.seatNumber === seat
                      );
                      return (
                        <div
                          key={`seat-${seat}`}
                          className={`seat ${seatSelected !== undefined ? (seatSelected?.isVIP ? "selectedVIP" : "selected") : ""}`}
                          onDoubleClick={() => handleSeatClick(row, seat, true)}
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

        {/* Edit modal */}
        <Modal
          dialogClassName={gridSize >= 10 && "modal-content-10"}
          show={showEditModal}
          onHide={handleCloseEditModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Hall</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Form.Group controlId="hallName" className="mb-3">
                <Form.Label>Hall Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter hall name"
                  value={editHallName}
                  onChange={(e) => setEditHallName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="editGridSize" className="mb-3">
                <Form.Label>Grid Size</Form.Label>
                <Form.Control
                  as="select"
                  value={editGridSize}
                  onChange={handleEditGridSizeChange}
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
                  style={{ width: `${10 * (editGridSize - 1) + 40 * editGridSize}px` }}
                  className="seat-grid"
                >
                  {Array.from({ length: editGridSize }).map((_, row) =>
                    Array.from({ length: editGridSize }).map((_, seat) => {
                      const editSeatSelected = editSelectedSeats.find(
                        (s) => s.rowNumber === row && s.seatNumber === seat
                      );
                      return (
                        <div
                          key={`seat-${seat}`}
                          className={`seat ${editSeatSelected !== undefined ? (editSeatSelected?.isVIP ? "selectedVIP" : "selected") : ""}`}
                          onClick={() => handleEditSeatClick(row, seat)}
                          onDoubleClick={() => handleEditSeatClick(row, seat, true)}
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
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleEditHall}>
              Edit Hall
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete modal */}
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
