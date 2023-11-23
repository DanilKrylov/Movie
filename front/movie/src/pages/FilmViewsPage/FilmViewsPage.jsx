import React from 'react'
import { useMemo } from 'react';
import { useEffect } from 'react';
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { Form, Button, Modal} from 'react-bootstrap';
import { NavBar } from '../../components/NavBar'
import { $host } from '../../http/httpService';
import { SearchBar } from '../CompanyCinemasPage/SearchBar';
import FilmViewsList from './FilmViewsList/FilmViewsList';

export default function FilmViewsPage() {
    const [searchString, setSearchString] = useState();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filmViews, setFilmViews] = useState();
    const { handleSubmit, control, formState, setError } = useForm();
    const { errors } = formState;

    const [halls, setHalls] = useState();
    const [films, setFilms] = useState();

    useEffect(() => {
      fetchFilmViews();
    }, [])

    const getHalls = async () => {
      const response = await $host.get("Halls");
      return response.data;
    }

    const getFilms = async () => {
      const response = await $host.get("Films");
      return response.data;
    }

    const filteredFilmViews = useMemo(() => {
        return filmViews?.filter(c => !searchString ||
            c?.film?.title.includes(searchString) ||
            c?.hall?.name.includes(searchString) ||
            c?.film?.director.includes(searchString) ||
            c?.film?.description.includes(searchString) ||
            c?.hall?.cinema?.name.includes(searchString) ||
            c?.film?.genre.includes(searchString))
    }, [searchString, filmViews])

    const handleShowCreateModal = async () => {
      setHalls(await getHalls());
      setFilms(await getFilms());
      setShowCreateModal(true);
    }

    const handleCloseCreateModal = () => {
      setShowCreateModal(false);
    }

  const onDelete = async (id) => {
    setFilmViews(filmViews.filter((filmView) => filmView?.id !== id));
    await $host.delete(`FilmViews/${id}`);
  };
    
    const onSubmit = async (data) => {
      await $host.post("FilmViews", data);

      handleCloseCreateModal();
  
      await fetchFilmViews();
    }

    const fetchFilmViews = async () => {
      const response = await $host.get("FilmViews");
      setFilmViews(response.data);
    } 
    
  return (
    <div>
        <NavBar></NavBar>
        <div className="container mt-4">
        <div className="p-4">
          <SearchBar setSearchString={setSearchString} handleShowCreateModal={handleShowCreateModal}></SearchBar>
          <FilmViewsList onDelete={onDelete} getHalls={getHalls} getFilms={getFilms} filmViews={filteredFilmViews} fetchFilmViews={fetchFilmViews}></FilmViewsList>
        </div>
      </div>
      
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
            <Modal.Header closeButton>
              <Modal.Title>Create film view</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>

            <Form.Group controlId="startTime" className="mb-3">
                  <Form.Label>Start time</Form.Label>
                  <Controller
                    name="startTime"
                    control={control}
                    defaultValue=""
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
          defaultValue=""
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
          defaultValue=""
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
                    Create film view
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
  )
}
