import { ParagraphProps } from 'antd/lib/typography/Paragraph'
import { TextProps } from 'antd/es/typography/Text'
import { TitleProps } from 'antd/lib/typography/Title'
import { Typography } from 'antd'
import styled from '@emotion/styled'

interface TextPropsI extends TextProps {}

const StyledText = styled(Typography.Text)`
  white-space: normal;
  overflow-wrap: break-word;
`

const StyledTitle = styled(Typography.Title)`
  white-space: normal;
  overflow-wrap: break-word;
`

const StyledParagraph = styled(Typography.Paragraph)`
  white-space: normal;
  overflow-wrap: break-word;
`

export function Text(props: TextPropsI) {
  return (
    <StyledText
      style={{
        // fontSize: 16,
        whiteSpace: 'normal', // Ensures text wraps
        overflowWrap: 'break-word' // Breaks words to prevent overflow
      }}
      {...props}
    >
      {props.children}
    </StyledText>
  )
}

interface TitlePropsI extends TitleProps {}

export function Title(props: TitlePropsI) {
  return (
    <StyledTitle
      style={{
        // fontSize: 16,
        whiteSpace: 'normal', // Ensures text wraps
        overflowWrap: 'break-word' // Breaks words to prevent overflow
      }}
      {...props}
    >
      {props.children}
    </StyledTitle>
  )
}

interface ParagraphPropsI extends ParagraphProps {}

export function Paragraph(props: ParagraphPropsI) {
  return (
    <StyledParagraph
      style={{
        // fontSize: 16,
        whiteSpace: 'normal', // Ensures text wraps
        overflowWrap: 'break-word' // Breaks words to prevent overflow
      }}
      {...props}
    >
      {props.children}
    </StyledParagraph>
  )
}

export * as Typography from '.'
