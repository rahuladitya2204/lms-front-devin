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

