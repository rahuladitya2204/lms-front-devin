import { TopicNode } from '@User/Screens/Admin/Topics/TopicsScreen'
import { Types } from '@adewaskar/lms-common'
import katex, { KatexOptions } from 'katex'
export function convertLatexToMathML(
  latexString: string,
  options?: KatexOptions
): string {
  try {
    // Use the KaTeX renderToString function with the specified options
    return katex.renderToString(latexString, {
      throwOnError: false,
      displayMode: true,
      output: 'htmlAndMathml',
      ...options // Spread operator to merge any additional options
    })
  } catch (error) {
    console.error('Error converting LaTeX to MathML:', error)
    return '' // Return an empty string or any fallback content you prefer
  }
}

// Function to transform an input string containing LaTeX into MathML
export function transformLatexInString(inputString: string): string {
  // Regular expression to match LaTeX patterns
  const latexPattern = /\$(.+?)\$/g

  // Replace all LaTeX patterns in the input string with their MathML equivalent
  return inputString.replace(latexPattern, (match, latex) => {
    return convertLatexToMathML(latex)
  })
}

export function printPdf(downloadUrl: string, filename = 'test.pdf') {
  // Create a temporary download link
  const downloadLink = document.createElement('a')
  downloadLink.href = downloadUrl
  downloadLink.target = '_blank' // Open in a new tab if it fails to download
  downloadLink.download = filename || 'downloaded.pdf' // You can specify the default filename here

  // Append the link to the document and click it
  document.body.appendChild(downloadLink)
  downloadLink.click()

  // Clean up by removing the link and revoking the Blob URL
  document.body.removeChild(downloadLink)
  window.URL.revokeObjectURL(downloadUrl)
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

export const buildTopicTree = (topics: Types.Topic[], topicId?: string, level?: number) => {
  const buildTreeData = (
    topics: Types.Topic[],
    parentId?: string,
    currentLevel: number = 1
  ): TopicNode[] => {
    if (parentId) {
      return buildSubTreeData(parentId, topics, currentLevel);
    } else {
      // @ts-ignore
      return topics.filter(topic => !topic.parentId).map(topic => {
        const children = level === undefined || currentLevel < level ? buildSubTreeData(topic._id + '', topics, currentLevel + 1) : [];
        return {
          ...topic,
          value: topic._id,
          title: topic.title,
          disabled: level !== undefined && currentLevel === level - 1 && children.length > 0,
          children
        };
      });
    }
  };

  const buildSubTreeData = (
    parentId: string,
    topics: Types.Topic[],
    currentLevel: number
  ): TopicNode[] => {
    const subTopics = topics
      .filter(topic => topic.parentId === parentId)
      .map(topic => {
        const children = level === undefined || currentLevel < level ? buildSubTreeData(topic._id + '', topics, currentLevel + 1) : [];
        return {
          ...topic,
          value: topic._id,
          title: topic.title,
          disabled: level !== undefined && currentLevel === level - 1 && children.length > 0,
          children
        };
      });
    // @ts-ignore
    return [...subTopics];
  };

  return buildTreeData(topics, topicId);
};