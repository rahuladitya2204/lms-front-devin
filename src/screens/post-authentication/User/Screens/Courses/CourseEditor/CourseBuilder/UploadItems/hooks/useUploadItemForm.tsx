import { Types, User } from '@adewaskar/lms-common'
import { useOutletContext, useParams } from "react-router";

import { FormInstance } from "antd/lib/form/Form";
import { debounce } from 'lodash';
import { findSectionItem } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import { useEffect } from "react";
import useMessage from '@Hooks/useMessage';

function useUploadItemForm(form?:FormInstance) {
  let { itemId, id: courseId } = useParams();
  const { data: course } = User.Queries.useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  });
  const message = useMessage();
  const { mutate: updateItemApi } = User.Queries.useUpdateCourseItem();
  const updateItem = debounce(updateItemApi, 300);
  const [items] = useOutletContext<[Types.CourseSection[],(sectionId:string,data:Types.CourseSectionItem)=>void,Function]>();
  const item:Types.CourseSectionItem = findSectionItem(itemId+'', items) || {title:'',description:''};
  const currentItemIndex = course.sections.map(s=>s.items).flat().findIndex(i => i._id === item?._id);
  const section = course.sections.find(section => {
    if (section.items.find(i => i._id === item._id)) {
      return section;
    }
  }) || {_id:'',items:[],title:''}
  const { data: topics } = User.Queries.useGetTopics();

  useEffect(() => {
    // Convert topics from array of objects to array of strings
    const topicStrings = item.topics?.map(topic => topic.title) || []; // ADDED
    form?.setFieldsValue({ ...item, topics: topicStrings }); // MODIFIED
  }, [item]);

  const handleTopicsChange = (topicStrings: string[]) => { // ADDED
    // Convert array of strings back to array of objects
    const existingTopicTitles = topics.map(t => t.title);
    const newTopics = topicStrings.map(title => {
      if (existingTopicTitles.includes(title)) {
        // Existing topic, return with its ID
        return {
          title,
          topicId: topics.find(t => t.title === title)?._id || ''
        };
      } else {
        // New topic, return without ID
        return { title, topicId: '' };
      }
    });
    onFormChange({ topics: newTopics });
  };

  const onFormChange = (data: Partial<Types.CourseSectionItem>) => {

      const newItem = {
        ...item,
        ...data
      };

    updateItem({
      courseId:courseId+'',
      itemId: itemId+'',
      data: newItem,
    }, {
      onSuccess: () => {
        message.open({
          type: 'success',
          content: `Saved`
        })
        }
      })
    // saveCourse();
  }
  // console.log(item,'item')
  return { onFormChange, handleTopicsChange,form,topics, item, sectionId: section._id, courseId, itemId,section,currentItemIndex };
  } 
  

export default useUploadItemForm;