import React, { useEffect } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';
import { Error } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';

import { windowScrollTo } from '../../data/utils';
import {
  FORBIDDEN_REQUEST,
  INTERNAL_SERVER_ERROR,
  TPA_AUTHENTICATION_FAILURE,
  TPA_SESSION_EXPIRED,
} from '../data/constants';
import { FIRST_STEP, SECOND_STEP, SIMPLIFIED_REGISTRATION_VARIATION } from '../data/optimizelyExperiment/helper';
import messages from '../messages';

const RegistrationFailureMessage = (props) => {
  const { formatMessage } = useIntl();
  const {
    context, errorCode, failureCount, simplifyRegistrationExpVariation, simplifiedRegistrationPageStep,
  } = props;

  useEffect(() => {
    windowScrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }, [errorCode, failureCount]);

  if (!errorCode) {
    return null;
  }

  let errorMessage;
  switch (errorCode) {
    case INTERNAL_SERVER_ERROR:
      errorMessage = formatMessage(messages['registration.request.server.error']);
     break;
    case FORBIDDEN_REQUEST:
      errorMessage = formatMessage(messages['registration.rate.limit.error']);
      break;
    case TPA_AUTHENTICATION_FAILURE:
      errorMessage = formatMessage(messages['registration.tpa.authentication.failure'],
        {
          platform_name: getConfig().SITE_NAME,
          lineBreak: <br />,
          errorMessage: context.errorMessage,
        });
      break;
    case TPA_SESSION_EXPIRED:
      errorMessage = formatMessage(messages['registration.tpa.session.expired'], { provider: context.provider });
      break;
    default:
      if (simplifyRegistrationExpVariation === SIMPLIFIED_REGISTRATION_VARIATION
          && simplifiedRegistrationPageStep === SECOND_STEP) {
        errorMessage = formatMessage(messages['simplify.registration.form.submission.error']);
      } else {
        errorMessage = formatMessage(messages['registration.empty.form.submission.error']);
      }
      break;
  }

  return (
    <Alert id="validation-errors" className="mb-5" variant="danger" icon={Error}>
      <Alert.Heading>{formatMessage(messages['registration.request.failure.header'])}</Alert.Heading>
      <p>{errorMessage}</p>
    </Alert>
  );
};

RegistrationFailureMessage.defaultProps = {
  context: {
    errorMessage: null,
  },
  simplifyRegistrationExpVariation: '',
  simplifiedRegistrationPageStep: FIRST_STEP,
};

RegistrationFailureMessage.propTypes = {
  context: PropTypes.shape({
    provider: PropTypes.string,
    errorMessage: PropTypes.string,
  }),
  errorCode: PropTypes.string.isRequired,
  failureCount: PropTypes.number.isRequired,
  simplifyRegistrationExpVariation: PropTypes.string,
  simplifiedRegistrationPageStep: PropTypes.string,
};

export default RegistrationFailureMessage;
