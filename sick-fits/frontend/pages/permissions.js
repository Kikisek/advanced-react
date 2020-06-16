import PleaseSignIn from '../components/PleaseSignIn';
import Permissions from '../components/Permissions.js';

const PermissionsPage = props => (
  <div>
    <PleaseSignIn>
      <Permissions />
    </PleaseSignIn>
  </div>
)

export default PermissionsPage;
