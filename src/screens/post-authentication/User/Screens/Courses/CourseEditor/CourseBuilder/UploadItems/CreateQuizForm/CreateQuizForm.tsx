import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  List,
  Modal,
  Row,
  Space,
  Switch,
  Tag,
  Tooltip,
} from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Fragment, useEffect } from 'react'

import ActionModal from '@Components/ActionModal/ActionModal'
import { AddItemProps } from '../UploadPDF'
import CreateQuestionForm from '../../../../../ExtraComponents/QuizQuestions/AddQuizQuestion'
import FileList from '@Components/FileList'
import GenerateWithAI from '../../../CourseInformation/GenerateWithAiButton'
import MediaUpload from '@Components/MediaUpload'
import TextArea from '@Components/Textarea'
import { uniqueId } from 'lodash'
import useUploadItemForm from '../hooks/useUploadItemForm'
import { useOutletContext } from 'react-router'
import { useCourseStore } from '../../useCourseStore'
import { useParams } from '@Router/index'
import Questions from '@User/Screens/ExtraComponents/QuizQuestions/Questions'

const { confirm } = Modal

const CreateQuizForm: React.FC<AddItemProps> = props => {
  const { updateItem } = useCourseStore(s => s)
  const [form] = Form.useForm()
  const {
    onFormChange,
    item,
    currentItemIndex,
    courseId,
    isLoading,
    sectionId,
    itemId,
    section
  } = useUploadItemForm(form)
  const courseQuiz = item?.quiz || Constants.INITIAL_COURSE_QUIZ
  console.log(item, courseQuiz, 'courseId')
  const deleteQuestion = (questionId: string) => {
    const newQuestions = [...courseQuiz.questions]
    const index = courseQuiz.questions.findIndex(
      (s: Types.TestQuestion) => s._id === questionId
    )
    newQuestions.splice(index, 1)
    updateItem(itemId + '', {
      quiz: {
        ...courseQuiz,
        questions: newQuestions
      }
    })
  }

  useEffect(
    () => {
      if (props.item) {
        form.setFieldsValue(props.item)
      }
    },
    [props.item]
  )
  const { language } = useOutletContext();
  return (
    <Fragment>
      <Form.Item name={["title", 'text', language]} label="Title" required>
        <Input placeholder="Enter Quiz Title" />
      </Form.Item>
      <Form.Item name={["description", 'text', language]}>
        <TextArea label="Description" name={["description", 'text', language]} />
      </Form.Item>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Card
            style={{ marginBottom: 20 }}
            title="Questions"
            extra={[
              <ActionModal
                width={850}
                cta={
                  <Button
                    style={{ marginLeft: 10 }}
                    size="small"
                    type="primary"
                    icon={<PlusOutlined />}
                  >
                    Add Question
                  </Button>
                }
              >
                <CreateQuestionForm
                  submit={question => {
                    console.log(question, 'added quest')
                    onFormChange({
                      quiz: {
                        ...courseQuiz,
                        questions: [...courseQuiz.questions, question]
                      }
                    })
                  }}
                />
              </ActionModal>
            ]}
          >
            <Questions
              language={language}
              onUpdate={question => {
                console.log(question, 'question')
                const newQuestions = [...courseQuiz.questions]
                newQuestions.forEach((q, index) => {
                  if (q._id === item._id) {
                    newQuestions[index] = question
                  }
                })
                onFormChange({
                  quiz: {
                    ...courseQuiz,
                    questions: newQuestions
                  }
                })
              }}
              data={courseQuiz.questions}
              deleteItem={item => deleteQuestion(item._id)}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card
            style={{ marginBottom: 20 }}
            title="Course Files"
            extra={
              <ActionModal
                cta={<Button icon={<UploadOutlined />}> Upload </Button>}
              >
                <MediaUpload
                  source={{
                    type: 'course.section.item.files',
                    value: courseId + ''
                  }}
                  uploadType="file"
                  prefixKey={`courses/${courseId}/${sectionId}/${itemId
                    }/files/${uniqueId()}`}
                  onUpload={({ name, _id }) => {
                    onFormChange({
                      files: [...item.files, { name, file: _id }]
                    })
                  }}
                />
              </ActionModal>
            }
          >
            <FileList
              onDeleteFile={(fileId: string) => {
                const files = item.files.filter((f: any) => f.file !== fileId)
                onFormChange({ files })
              }}
              files={item.files}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default CreateQuizForm
