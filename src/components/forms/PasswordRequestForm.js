import React from 'react'
import PropTypes from 'prop-types'
import isEmail from 'validator/lib/isEmail'
import { Field, reduxForm } from 'redux-form'
import { intlShape } from 'react-intl'

import { FormWithLinks, SemanticInput } from '.'

const validate = ({ email }) => {
  const errors = {}

  // the email address needs to be valid
  if (!email || !isEmail(email)) {
    errors.email = 'form.common.email.invalid'
  }

  return errors
}

const propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool.isRequired,
}

const PasswordRequestForm = ({ intl, invalid, handleSubmit: onSubmit }) => {
  const button = {
    invalid,
    label: intl.formatMessage({
      defaultMessage: 'Submit',
      id: 'form.common.button.submit',
    }),
    onSubmit,
  }
  const links = [
    {
      href: '/user/login',
      label: intl.formatMessage({
        defaultMessage: 'Back to login',
        id: 'form.passwordReset.backToLogin',
      }),
    },
  ]

  return (
    <FormWithLinks button={button} links={links}>
      <Field
        autoFocus
        required
        component={SemanticInput}
        errorMessage={intl.formatMessage({
          defaultMessage: 'Please provide a valid email address.',
          id: 'form.email.invalid',
        })}
        icon="mail"
        intl={intl}
        label={intl.formatMessage({
          defaultMessage: 'Email',
          id: 'form.email.label',
        })}
        name="email"
        type="email"
      />
    </FormWithLinks>
  )
}

PasswordRequestForm.propTypes = propTypes

export default reduxForm({
  form: 'passwordRequest',
  validate,
})(PasswordRequestForm)