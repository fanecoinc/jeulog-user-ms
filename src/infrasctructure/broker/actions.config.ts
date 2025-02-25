import { permissionActions } from './actions/Permission.actions';
import { roleActions } from './actions/Roles.actions';
import { userActions } from './actions/User.actions';

const actions = {
  ...permissionActions,
  ...roleActions,
  ...userActions,
};

export { actions };
