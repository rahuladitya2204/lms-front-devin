
import { debounce, uniqueId } from 'lodash'

import axios from 'axios';
import { Learner, Types } from '@adewaskar/lms-common';
import numbro from 'numbro';
import 'numbro/dist/languages.min'; // Import all languages
import { NumberFormat } from '@formatjs/intl-numberformat';

// Create a map for your language codes
const languageMap = {
  eng: 'en-IN', // English (India)
  hin: 'hi-IN', // Hindi (India)
  guj: 'gu-IN'  // Gujarati (India)
};

export function printPdf(downloadUrl: string, filename = 'test.pdf') {
  // Create a temporary download link
  // const downloadLink = document.createElement('a')
  // downloadLink.href = downloadUrl
  // downloadLink.target = '_blank' // Open in a new tab if it fails to download
  // downloadLink.download = filename || 'downloaded.pdf' // You can specify the default filename here

  // // Append the link to the document and click it
  // document.body.appendChild(downloadLink)
  // downloadLink.click()

  // // Clean up by removing the link and revoking the Blob URL
  // document.body.removeChild(downloadLink)
  // window.URL.revokeObjectURL(downloadUrl)

  downloadFileFromUrl(downloadUrl, filename);
}

// function base64ToArrayBuffer(base64: string) {
//   const binaryString = window.atob(base64) // Decode base64
//   const len = binaryString.length
//   const bytes = new Uint8Array(len)
//   for (let i = 0; i < len; i++) {
//     bytes[i] = binaryString.charCodeAt(i)
//   }
//   return bytes.buffer
// }

export const openWindow = (url: string, cb?: Function) => {
  const newWindow = window.open(url, '_blank')
  // @ts-ignore
  window.onComplete = (...args) => {
    cb && cb(...args)
    // debugger
    // newWindow?.close()
  }
}

export function isMongoId(str: string) {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/
  return objectIdRegex.test(str)
}

export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create a new FileReader instance
    const reader = new FileReader();

    // Set up the onload event handler to resolve the promise with the result
    reader.onload = () => {
      // The result attribute contains the data as a base64 encoded string
      const base64String = reader.result as string;
      resolve(base64String);
    };

    // Set up the onerror event handler to reject the promise in case of an error
    reader.onerror = (error) => {
      reject(error);
    };

    // Read the file as a data URL (which will be base64 encoded)
    reader.readAsDataURL(file);
  });
}


export function compareArrays<T>(arr1: T[], arr2: T[]): boolean {
  // Convert both arrays to Sets to remove duplicates and for efficient comparison
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  // Check if every element in set1 is also in set2
  // @ts-ignore
  for (let item of set1) {
    if (!set2.has(item)) {
      return false; // If any item in arr1 is not found in arr2, return false
    }
  }

  return true; // Every item in arr1 is found in arr2
}

// Example usage
const arr1 = [1, 2, 3, 4];
const arr2 = [4, 3, 2, 1];
const result = compareArrays(arr1, arr2);

console.log(result); // Output: true


export function requestCameraPermission() {
  return new Promise((resolve, reject) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // Permission granted, resolve the promise
          resolve(null);
        })
        .catch((error) => {
          // Permission denied, reject the promise with an error
          reject(new Error('Camera permission denied'));
        });
    } else {
      // getUserMedia not supported, reject the promise with an error
      reject(new Error('getUserMedia is not supported'));
    }
  });
}

export async function downloadFileFromUrl(fileUrl: string, fileName?: string): Promise<void> {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const extension = url.split(".").pop();
    link.download = fileName || (uniqueId() + "." + extension)
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}

export const validateSlug = async (slug: string, fn: (d: { slug: string }) => { exists: string }) => {
  try {
    const response = await fn({ slug });
    console.log(response, 'sssss')
    if (response.exists) {
      return Promise.reject(response.exists);
    }
  } catch (error) {
    console.error('Error checking slug:', error);
    return Promise.reject('An error occurred while checking the slug');
  }
}

export const getAxiosInstance = () => {

  // const api = setupCache(axios.create());
  const api = axios.create();
  return api;
}

export const useText = (language: string) => {
  const { data: TEXT } = Learner.Queries.useGetTexts();

  const FormatLangText = (key: string, variables: { [key: string]: string | number } = {}) => {
    const template = TEXT[key][language] || TEXT[key]['eng'] || '';

    // Replace placeholders with variable values if they exist
    return template.replace(/\{\{(.*?)\}\}/g, (_, varName) => {
      return variables[varName.trim()] !== undefined
        ? String(variables[varName.trim()])
        : `{{${varName}}}`; // Keep placeholder if variable is missing
    });
  };

  const FormatNumber = (number: number): string => {
    const locale = languageMap[language] || 'en-IN'; // Default to English (India)
    // Initialize the NumberFormat with the correct locale
    const formatter = new NumberFormat(locale);
    return formatter.format(number); // Format the number accordingly
  };

  return { FormatLangText, FormatNumber };
};
