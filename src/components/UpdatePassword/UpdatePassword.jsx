import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { Container, ContentLoader, Icon, Section } from 'components';

import { updatePasswordSelector } from 'store/selectors';
import { notifyApi } from 'notify';
import { updatePassword } from 'store/operations';
import { LOGIN_ROUTE } from 'routes/routes';

import css from './UpdatePassword.module.css';
import { UpdatePasswordSchema } from 'schemasValdiate/UpdatePasswordSchema';

export const UpdatePassword = () => {
  const [visible, setVisible] = useState(false);
  const [visibleEye, setVisibleEye] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { isLoading } = useSelector(updatePasswordSelector);

  const handleSubmit = ({ password }, actions) => {
    notifyApi(
      dispatch(updatePassword({ token, password }))
        .unwrap()
        .then(() => {
          actions.resetForm();
          navigate(LOGIN_ROUTE);
        }),
      `Updating your password`,
      true
    );
  };

  return (
    <Section className={css.sectionForm}>
      <Container className={css.Container}>
        <div className={css.titleFormThumb}>
          <h1 className={css.title}>Change your password</h1>

          <Formik
            initialValues={{
              password: '',
              passwordRepeat: '',
            }}
            validationSchema={UpdatePasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className={css.formContainer}>
                <div className={css.inputtThumb}>
                  <p className={css.textInput}>Enter your new password</p>
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
                      Send {isLoading && <ContentLoader />}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Container>
    </Section>
  );
};
