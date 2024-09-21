// utils/topicUtils.js

export const buildTopicHierarchy = (nodes, parent = null, topicsById = {}, topicHierarchy = new Map()) => {
    nodes.forEach((node) => {
      topicsById[node._id] = node;
    //   @ts-ignore
      topicHierarchy.set(node._id, parent ? parent._id : null);
      if (node.children) {
        buildTopicHierarchy(node.children, node, topicsById, topicHierarchy);
      }
    });
  };
  
  export const initializeTopicCounts = (topicsById) => {
    const topicMap = {};
    Object.keys(topicsById).forEach((id) => {
      topicMap[id] = {
        correct: 0,
        incorrect: 0,
        total: 0,
        topic: topicsById[id].title,
        _id: id,
        parentId: topicsById[id].parentId,
      };
    });
    return topicMap;
  };
  
  export const accumulateCountsUpToLevel = (
    metricsTopics,
    topicHierarchy,
    topicMap,
    topicsById,
    desiredLevel = 2
  ) => {
    metricsTopics.forEach((topp) => {
      const topicId = topp.topic;
      let currentTopicId = topicId;
      let level = 1;
  
      if (!currentTopicId) {
        console.warn(`Current topic ID is undefined for metric topic ${JSON.stringify(topp)}`);
        return;
      }
  
      // Traverse up to the desired level ancestor
      while (topicHierarchy.get(currentTopicId) && level < desiredLevel) {
        currentTopicId = topicHierarchy.get(currentTopicId);
        if (!currentTopicId) {
          console.warn(`Parent topic ID is undefined during traversal for topic ID ${topicId}`);
          break;
        }
        level++;
      }
  
      const ancestorId = currentTopicId;
  
      if (!ancestorId) {
        console.warn(`Ancestor ID is undefined for topic ID ${topicId}`);
        return; // Skip this iteration if ancestorId is undefined
      }
  
      // Initialize the topic in topicMap if it doesn't exist
      if (!topicMap[ancestorId]) {
        const ancestorTopic = topicsById[ancestorId];
        if (!ancestorTopic) {
          console.warn(`Ancestor topic not found for ID ${ancestorId}`);
          return; // Skip if ancestor topic is not found
        }
        topicMap[ancestorId] = {
          correct: 0,
          incorrect: 0,
          total: 0,
          topic: ancestorTopic.title,
          _id: ancestorId,
          parentId: ancestorTopic.parentId,
        };
      }
  
      // Accumulate the counts
      topicMap[ancestorId].correct += topp.correct;
      topicMap[ancestorId].incorrect += topp.incorrect;
      topicMap[ancestorId].total += topp.total;
    });
  };
  
  