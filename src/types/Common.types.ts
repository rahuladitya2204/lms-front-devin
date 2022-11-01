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
  id: string;
  type: string;
  data?: unknown;
  children: CourseTreeTypeNode[];
}

export interface CourseNodeValueType { title: string; data: unknown }

export interface UploadFileType {
  name: string;
  url: string;
}

export interface AddItemFormProps<T> {
  children?: React.ReactNode;
  onFormUpdate: (data: T) => void;
  formValues: T;
}
