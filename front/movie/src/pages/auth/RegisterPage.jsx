import React, { useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { registration } from '../../http/userAPI';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';

export const RegisterPage = () => {
    const { handleSubmit, control, formState, getValues, setError } = useForm();
    const { errors } = formState;
    const navigate = useNavigate();
    const { userSession } = useContext(Context);

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Handle registration logic here
        const registrationData = {
            login: data.login,
            password: data.password,
            name: data.name,
            address: data.address,
        };

        registration(registrationData).then((res) => {
            userSession.setUser({ login: data.login });
            userSession.setIsAuth(true);
            localStorage.setItem('token', res.jwtToken)
            navigate('');
        }).catch(() => {
            setError('login', {
                type: 'manual',
                message: 'User with the same email already exists.',
              });
        });

        console.log(data);
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center">Registration</h2>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group controlId="login" className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Controller
                                name="login"
                                control={control}
                                defaultValue=""

                                rules={{
                                    required: 'Login is required', pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                }}
                                render={({ field }) => (
                                    <>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter login"
                                            {...field}
                                            isInvalid={!!errors?.login}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors?.login?.message}
                                        </Form.Control.Feedback>
                                    </>
                                )}
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Controller
                                name="password"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters long',
                                    },
                                }}
                                render={({ field }) => (
                                    <>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter password"
                                            {...field}
                                            isInvalid={!!errors?.password}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors?.password?.message}
                                        </Form.Control.Feedback>
                                    </>
                                )}
                            />
                        </Form.Group>

                        <Form.Group controlId="confirmPassword" className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'Confirm Password is required',
                                    validate: (value) =>
                                        value === getValues().password ||
                                        'Passwords do not match',
                                }}
                                render={({ field }) => (
                                    <>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm password"
                                            {...field}
                                            isInvalid={!!errors?.confirmPassword}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors?.confirmPassword?.message}
                                        </Form.Control.Feedback>
                                    </>
                                )}
                            />
                        </Form.Group>

                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Controller
                                name="name"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Name is required' }}
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

                        <Form.Group controlId="address" className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Controller
                                name="address"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Address is required' }}
                                render={({ field }) => (
                                    <>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter address"
                                            {...field}
                                            isInvalid={!!errors?.address}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors?.address?.message}
                                        </Form.Control.Feedback>
                                    </>
                                )}
                            />
                        </Form.Group>

                        <div className="text-center">
                            <Button variant="primary" type="submit" style={{ width: '100%' }}>
                                Register
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};
