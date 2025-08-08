export const mockUserService = {
  createUser: jest.fn(),
  findOne: jest.fn(),
  getUser: jest.fn(),
  getUsers: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

export const mockAuthService = {
  validateUser: jest.fn(),
  createAccessToken: jest.fn(),
  validateUserById: jest.fn(),
};

export const mockPostService = {
  createPost: jest.fn(),
  getSinglePost: jest.fn(),
  getAllPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

export const mockCommandBus = {
  execute: jest.fn(),
};

export const mockQueryBus = {
  execute: jest.fn(),
};

export const mockJwtService = {
  sign: jest.fn(),
  signAsync: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
};

export const mockConfigService = {
  get: jest.fn(),
  getString: jest.fn(),
  getNumber: jest.fn(),
  getBoolean: jest.fn(),
  authConfig: {
    jwtExpirationTime: 3600,
    jwtSecret: 'test-secret',
  },
};

export const mockTranslationService = {
  translate: jest.fn(),
};

export const mockValidatorService = {
  isImage: jest.fn().mockReturnValue(true),
  isEmail: jest.fn().mockReturnValue(true),
};

export const mockAwsS3Service = {
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
};