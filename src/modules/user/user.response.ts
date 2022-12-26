import User from './user.interface';

namespace UserResponse {
  export interface Get extends ApiResponse {
    user: User;
  }

  export interface Update extends ApiResponse {
    user: User;
  }
}

export default UserResponse;
