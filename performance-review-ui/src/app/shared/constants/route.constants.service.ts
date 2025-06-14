
// Define shared path segments
const EVALUATION_FORM_INIT = 'evaluationform';
const ACCOUNT_INIT = 'account';

export const ROUTES = {
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  STAFF: 'staff/list',

  ACCOUNT: {
    REGISTER: `${ACCOUNT_INIT}/register`,
    EDIT: `${ACCOUNT_INIT}/edit-user/:id`,
  },
  EVALUATION_FORM: {
    TEMPLATE: `${EVALUATION_FORM_INIT}/template`,
    CREATE: `${EVALUATION_FORM_INIT}/create`,
    EDIT: `${EVALUATION_FORM_INIT}/edit/:id`,
  },
};
