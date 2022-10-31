export interface SignupData {
  email: string;
  password: string;
  name?: SVGStringList;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface PresignedUrlResponseData {
  key: string;
  url: string;
}

export interface PresignedUrlRequestData {
  fileType: string;
}

export interface CourseTreeTypeNode {
  title: string;
  type: string;
  key: string;
  children: CourseTreeTypeNode[];
}
