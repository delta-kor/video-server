import User from './user.interface';

namespace UserResponse {
  export interface Get extends ApiResponseWithToken {
    user: User;
  }
}

export default UserResponse;
