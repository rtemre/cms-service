export class Constants {
  static config = {
    PrefixPath: '/',
  };
  static Http = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
  };

  static UserRole = {
    ADMIN: 'admin',
    USER: 'user',
  };

  static Language = {
    EN: 'en',
  };

  static Pagination = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    DEFAULT_OFFSET: 0,
  };

  static CmsMessage = {
    SUCCESS: 'Success',
    CONTENT_UPDATED_SUCCESSFULLY: 'Content updated succesfully',
    CMS_SUCCESS: 'Cms data operation successful',
    CONTENT_CREATED_SUCCESSFULLY: 'Content created successfully',
    CONTENT_TYPE_NOT_FOUND: 'Content type not found',
    CONTENTS_FETCHED_SUCCESSFULLY: 'Contents fetched successfully',
    CONTENT_TYPE_FOUND: 'Content types fetched successfully',
    CMS_DATA_FOUND: 'Cms data fetched successfully',
    CMS_DATA_CREATED: 'Cms data created successfully',
    CMS_DATA_UPDATED: 'Cms data updated successfully',
    CMS_DATA_NOT_FOUND: 'Cms data not found',
    CONTENT_DELETED_SUCCESSFULLY: 'Content deleted successfully',
  };

  static ErrorMessage = {
    CONTENT_NOT_FOUND: 'Content not found',
    CONTENT_ALREADY_EXIST: 'Content already exist',
    INVALID_TOKEN: 'Invalid token',
    INVALID_USER: 'Invalid User',
    REPEATED_DATA_FOUND: 'Repeated data found',
    CONFLICT: 'Conflict',
    NOT_FOUND: 'Not found',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    HEADER_AUTHORIZATION_NOT_passed: 'Header authorization not passed',
    TOKEN_DOES_NOT_CONTAIN_ID_OR_ROLE:
      'Token does not contain id or role of user',
  };
}
