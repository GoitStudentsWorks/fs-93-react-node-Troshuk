import { Formik, Form, Field } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { notifyApi } from 'notify';

import { Container, Section, ContentLoader } from 'components';

import { LOGIN_ROUTE } from 'routes/routes';
import { forgotPasswordSelector } from 'store/selectors';
import { forgotPassword } from 'store/operations';

import css from './ForgotPassword.module.css';

export const ForgotPassword = () => {
  const { isLoading } = useSelector(forgotPasswordSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = ({ email }, actions) => {
    notifyApi(
      dispatch(forgotPassword({ email }))
        .unwrap()
        .then(() => {
          actions.resetForm();
          navigate(LOGIN_ROUTE);
        }),
      `Sending your password reset email`,
      true
    );
  };

  return (
    <Section className={css.sectionForm}>
      <Container className={css.resetPasswordContainer}>
        <div className={css.titleFormThumb}>
          <h1 className={css.title}>
            Forgot your password?
            <br />
            Enter your email
          </h1>

          <Formik
            initialValues={{
              email: '',
            }}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className={css.formContainer}>
                <div className={css.containerEmail}>
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
                <div>
                  <button
                    type="submit"
                    className={css.buttonForm}
                    disabled={isLoading}
                  >
                    Send {isLoading && <ContentLoader />}
                  </button>
                </div>
                <NavLink to={LOGIN_ROUTE} className={css.redirectLink}>
                  Sign In
                </NavLink>
              </Form>
            )}
          </Formik>
        </div>
      </Container>
    </Section>
  );
};
