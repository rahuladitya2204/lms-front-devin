import { ReactNode } from 'react'
import { CourseSectionItem } from './Courses.types'

export interface SignupData {
  email: string;
  password: string;
  name: string;
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

export interface UploadFileType {
  name: string;
  url: string;
}

export interface AddItemFormProps<T> {
  children?: React.ReactNode;
  onFormUpdate: (data: T) => void;
  formValues: T;
}

export interface MenuItemNode {
  title: string;
  icon?: ReactNode;
  path: string;
  children?: MenuItemNode[];
}

export interface CreateItemPropsI {
  children?: React.ReactNode;
  onFinish: (data: Partial<CourseSectionItem>) => void;
}

export interface ValueUnitType {
  value: number;
  unit: string;
}