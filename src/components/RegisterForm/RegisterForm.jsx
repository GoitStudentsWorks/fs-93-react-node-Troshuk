import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RegisterSchema } from '../../schemasValdiate/RegisterSchema.jsx';
import { Container, ContentLoader, Icon, Section } from 'components';

import { signUpSelector } from 'store/selectors';
import { notifyApi } from 'notify';
import { signUp } from 'store/operations.js';
import { LOGIN_ROUTE } from 'routes/routes.js';

import css from '../LoginFrom/LoginFrom.module.css';

export const RegisterForm = () => {
  const [visible, setVisible] = useState(false);
  const [visibleEye, setVisibleEye] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(signUpSelector);

  const handleSubmit = (values, { resetForm }) => {
    const { email, password } = values;
    const data = { email, password };

    notifyApi(
      dispatch(signUp(data))
        .unwrap()
        .then(() => {
          resetForm();
          navigate(LOGIN_ROUTE);
        }),
      `Creating new user: ${data.email}`,
      true
    );
  };

  return (
    <Section className={css.sectionForm}>
      <Container className={css.loginContainer}>
        <Formik
          initialValues={{
            email: '',
            password: '',
            passwordRepeat: '',
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className={css.formContainer}>
              <div className={css.containerEmail}>
                <h1 className={css.titleForm}>Sign Up</h1>
                <p className={css.textInput}>Enter your email</p>
                <Field
                  type="text"
                  name="email"
                  placeholder="E-mail"
                  className={`${css.inputField} ${
                    errors.email && touched.email
                      ? `${css.inputError} ${css.error}`
                      : ''
                  }`}
                />
                {errors.email && touched.email && (
                  <p className={`${css.errorText} ${css.errorText}`}>
                    {errors.email}
                  </p>
                )}
              </div>
              <div className={css.containerEmail}>
                <p className={css.textInput}>Enter your password</p>
                <div className={css.inputWithIcon}>
                  <Field
                    type={visible ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    className={`${css.inputField} ${
                      errors.password && touched.password
                        ? `${css.inputError} ${css.error}`
                        : ''
                    }`}
                  />
                  <Icon
                    id={visible ? 'icon-eye' : 'icon-eye-slash'}
                    width="16"
                    height="16"
                    className={css.iconField}
                    onClick={() => setVisible(!visible)}
                  />
                </div>

                {errors.password && touched.password && (
                  <p className={css.errorText}>{errors.password}</p>
                )}
              </div>
              <div>
                <p className={css.textInput}>Repeat password</p>
                <div className={css.inputWithIcon}>
                  <Field
                    type={visibleEye ? 'text' : 'password'}
                    name="passwordRepeat"
                    placeholder="Repeat password"
                    className={`${css.inputField} ${
                      errors.passwordRepeat && touched.passwordRepeat
                        ? `${css.inputError} ${css.error}`
                        : ''
                    }`}
                  />
                  <Icon
                    id={visibleEye ? 'icon-eye' : 'icon-eye-slash'}
                    width="16"
                    height="16"
                    className={css.iconField}
                    onClick={() => setVisibleEye(!visibleEye)}
                  />
                </div>

                {errors.passwordRepeat && touched.passwordRepeat && (
                  <p className={css.errorText}>{errors.passwordRepeat}</p>
                )}
                <button
                  type="submit"
                  className={css.buttonForm}
                  disabled={isLoading}
                >
                  Sign Up {isLoading && <ContentLoader />}
                </button>
              </div>
              <div className={css.redirectLink}>
                <NavLink to={LOGIN_ROUTE} className={css.linkForm}>
                  Sign In
                </NavLink>
              </div>
            </Form>
          )}
        </Formik>
      </Container>
    </Section>
  );
};
