import React, { useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { login } from '../../http/userAPI';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';

export const LoginPage = () => {
  const { handleSubmit, control, formState, setError } = useForm();
  const { errors } = formState;
  const navigate = useNavigate()
  const { userSession } = useContext(Context)

  const onSubmit = async (data) => {
    data.login = data.email;
    data.email = undefined
    login(data).then((res) => {
      console.log(res)
      if (res.successed) {
        userSession.setUser({ login: data.login })
        userSession.setIsAuth(true)
        localStorage.setItem('token', res.jwtToken)
        navigate('/')
        return
      }

      setError('email',{
        type: 'manual',
        message: "Email or password entered incorectly",
      })
    })
  };

console.log(errors)

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center">Login</h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="email" className="mb-3"> {/* Added padding */}
              <Form.Label>Email address</Form.Label>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field }) => (
                  <>
                    <Form.Control
                      type="text"
                      placeholder="Enter email"
                      {...field}
                      isInvalid={!!errors?.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.email?.message}
                    </Form.Control.Feedback>
                  </>
                )}
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-3"> {/* Added padding */}
              <Form.Label>Password</Form.Label>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Password is required',
                }}
                render={({ field }) => (
                  <>
                    <Form.Control
                      type="password"
                      placeholder="Password"
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

            <div className="text-center">
              <Button variant="primary" type="submit" style={{ width: '100%' }}> {/* Button takes up 100% width */}
                Login
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
