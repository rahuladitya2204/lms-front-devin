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
  Tooltip,
  Typography
} from 'antd'
import { Fragment, useEffect } from 'react'
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import FileList from '@Components/FileList'
import MediaUpload from '@Components/MediaUpload'
import TextArea from '@Components/Textarea'
import { Constants, Types } from '@adewaskar/lms-common'
import { getReadingTime } from '../../utils'
import { uniqueId } from 'lodash'
import useUploadItemForm from '../hooks/useUploadItemForm'
import { AddItemProps } from '../UploadPDF'
import CreateQuestionForm from './CreateQuestionForm'

const { confirm } = Modal

const CreateQuizForm: React.FC<AddItemProps> = props => {
  const [form] = Form.useForm()
  const { onFormChange, item, courseId, sectionId, itemId } = useUploadItemForm(
    form
  )
  const courseQuiz = item?.quiz || Constants.INITIAL_COURSE_QUIZ

  const deleteQuestion = (questionId: string) => {
    const newQuestions = [...courseQuiz.questions]
    const index = courseQuiz.questions.findIndex(
      (s: Types.CourseQuizQuestion) => s._id === questionId
    )
    newQuestions.splice(index, 1)
    onFormChange({
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

  return (
    <Fragment>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={e => {
          console.log(e, 'eee')
          const data: Partial<Types.CourseSectionItem> = {
            ...e,
            metadata: {
              duration: 100
            }
          }
          console.log(data, 'aaaaa')
          onFormChange(data)
        }}
      >
        <Form.Item name="title" label="Title" required>
          <Input placeholder="Enter Quiz Title" />
        </Form.Item>
        <Form.Item name="description">
          <TextArea label="Description" name="description" />
        </Form.Item>
        {/* <Form.Item>
          <Checkbox
            checked={item.isPreview}
            onChange={e => {
              const isPreview = e.target.checked
              onFormChange({ isPreview })
            }}
          >
            Avail this as a free lecture
          </Checkbox>
        </Form.Item> */}
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Card
              style={{ marginBottom: 20 }}
              title="Questions"
              extra={
                <ActionModal
                  width={650}
                  cta={
                    <Button type="primary" icon={<PlusOutlined />}>
                      Add
                    </Button>
                  }
                >
                  <CreateQuestionForm
                    saveQuestion={question => {
                      onFormChange({
                        quiz: {
                          ...courseQuiz,
                          questions: [...courseQuiz.questions, question]
                        }
                      })
                    }}
                  />
                </ActionModal>
              }
            >
              <List
                bordered
                dataSource={courseQuiz.questions}
                renderItem={(item: Types.CourseQuizQuestion) => (
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    extra={[
                      <Typography.Text>
                        {item.answers.length} options{' '}
                        <Tooltip title="Delete Question">
                          <DeleteOutlined
                            onClick={() => {
                              confirm({
                                title: 'Are you sure?',
                                // icon: <ExclamationCircleOutlined />,
                                content: `You want to delete this question`,
                                onOk() {
                                  deleteQuestion(item._id)
                                },
                                okText: 'Yes, Delete'
                              })
                            }}
                            style={{ marginLeft: 10 }}
                          />
                        </Tooltip>
                      </Typography.Text>
                    ]}
                  >
                    <ActionModal
                      width={650}
                      cta={
                        <Typography.Text strong>{item.title}</Typography.Text>
                      }
                    >
                      <CreateQuestionForm
                        saveQuestion={question => {
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
                        question={item}
                      />
                    </ActionModal>
                  </List.Item>
                )}
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
                    prefixKey={`courses/${courseId}/${sectionId}/${
                      itemId
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
                userType="user"
                onDeleteFile={(fileId: string) => {
                  const files = item.files.filter(f => f.file !== fileId)
                  onFormChange({ files })
                }}
                files={item.files}
              />
            </Card>
          </Col>
        </Row>
      </Form>
    </Fragment>
  )
}

export default CreateQuizForm
