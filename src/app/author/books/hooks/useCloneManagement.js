// hooks/useCloneManagement.js
'use client';
import { useState } from 'react';

export function useCloneManagement(bookManagement) {
  const { 
    bookTitle, 
    currentBookId, 
    setCurrentBookId, 
    topics, 
    setTopics, 
    setLoading, 
    saveFormState,
    fetchBooks 
  } = bookManagement;

  // Clone Topic Modal State
  const [showCloneTopicModal, setShowCloneTopicModal] = useState(false);
  const [allBooks, setAllBooks] = useState([]);
  const [selectedSourceBook, setSelectedSourceBook] = useState('');
  const [availableTopics, setAvailableTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topicTitles, setTopicTitles] = useState({});

  // Clone Subtopic Modal State
  const [showCloneSubtopicModal, setShowCloneSubtopicModal] = useState(false);
  const [selectedSourceBookForSubtopic, setSelectedSourceBookForSubtopic] = useState('');
  const [availableTopicsForSubtopic, setAvailableTopicsForSubtopic] = useState([]);
  const [selectedSourceTopic, setSelectedSourceTopic] = useState('');
  const [availableSubtopics, setAvailableSubtopics] = useState([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState([]);
  const [subtopicTitles, setSubtopicTitles] = useState({});
  const [targetTopicIndex, setTargetTopicIndex] = useState(null);

  // Sync Changes Modal State
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleOpenCloneTopicModal = async () => {
    if (!bookTitle.trim()) {
      alert('Please enter a book title first');
      return;
    }

    let bookId = currentBookId;

    if (!bookId) {
      setLoading(true);
      const res = await fetch('/api/author/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: bookTitle })
      });
      
      const data = await res.json();
      if (data.success) {
        bookId = data.bookId;
        setCurrentBookId(bookId);
        saveFormState(bookTitle, bookId, topics);
      } else {
        alert('Error: ' + data.error);
        setLoading(false);
        return;
      }
      setLoading(false);
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/superadmin/books');
      const data = await res.json();
      if (data.success) {
        setAllBooks(data.data || []);
        setShowCloneTopicModal(true);
      } else {
        alert('Failed to load books');
      }
    } catch (error) {
      console.error('Error loading books:', error);
      alert('Failed to load books');
    }
    setLoading(false);
  };

  const handleSourceBookChange = async (bookId) => {
    setSelectedSourceBook(bookId);
    setSelectedTopics([]);
    setTopicTitles({});
    
    if (!bookId) {
      setAvailableTopics([]);
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/superadmin/topics?bookId=${bookId}`);
      const data = await res.json();
      if (data.success) {
        setAvailableTopics(data.data || []);
      }
    } catch (error) {
      console.error('Error loading topics:', error);
    }
    setLoading(false);
  };

  const handleTopicSelection = (topicId) => {
    setSelectedTopics(prev => {
      if (prev.includes(topicId)) {
        const newSelected = prev.filter(id => id !== topicId);
        const newTitles = { ...topicTitles };
        delete newTitles[topicId];
        setTopicTitles(newTitles);
        return newSelected;
      } else {
        const topic = availableTopics.find(t => t.id === topicId);
        if (topic) {
          setTopicTitles(prev => ({ ...prev, [topicId]: topic.name }));
        }
        return [...prev, topicId];
      }
    });
  };

  const handleSelectAllTopics = () => {
    if (selectedTopics.length === availableTopics.length) {
      setSelectedTopics([]);
      setTopicTitles({});
    } else {
      const allIds = availableTopics.map(t => t.id);
      const titles = {};
      availableTopics.forEach(t => {
        titles[t.id] = t.name;
      });
      setSelectedTopics(allIds);
      setTopicTitles(titles);
    }
  };

  const handleCloneTopicsSave = async () => {
    if (selectedTopics.length === 0) {
      alert('Please select at least one topic to clone');
      return;
    }
    
    if (!currentBookId) {
      alert('Book ID not found. Please try again.');
      return;
    }
    
    setLoading(true);
    try {
      const clonedTopicIds = [];
      
      for (const topicId of selectedTopics) {
        const newTopicName = topicTitles[topicId];
        
        const res = await fetch('/api/superadmin/clone-topic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic_id: topicId,
            new_book_id: parseInt(currentBookId),
            new_topic_name: newTopicName
          })
        });
        
        const data = await res.json();
        if (!data.success) {
          alert(`Failed to clone topic: ${data.error}`);
          setLoading(false);
          return;
        }
        
        if (data.data && data.data.newTopicId) {
          clonedTopicIds.push({
            id: data.data.newTopicId,
            name: newTopicName,
            originalId: topicId
          });
        }
      }
      
      const topicsRes = await fetch(`/api/superadmin/topics?bookId=${currentBookId}`);
      const topicsData = await topicsRes.json();
      
      if (topicsData.success) {
        const newTopics = [...topics];
        
        for (const clonedInfo of clonedTopicIds) {
          const topicFromDb = topicsData.data.find(t => t.id === clonedInfo.id);
          
          if (topicFromDb) {
            const originalSubtopicsRes = await fetch(`/api/superadmin/subtopics?topicId=${clonedInfo.originalId}`);
            const originalSubtopicsData = await originalSubtopicsRes.json();
            const originalSubtopics = originalSubtopicsData.success ? originalSubtopicsData.data : [];
            
            const subtopicsRes = await fetch(`/api/superadmin/subtopics?topicId=${topicFromDb.id}`);
            const subtopicsData = await subtopicsRes.json();
            
            const subtopics = subtopicsData.success ? (subtopicsData.data || []).map((s, idx) => {
              const originalSubtopic = originalSubtopics[idx];
              return {
                id: Date.now() + Math.random() + idx,
                name: s.name,
                subtopicId: s.id,
                isCloned: true,
                originalSubtopicId: originalSubtopic ? originalSubtopic.id : null,
                cloneId: s.clone_id || null
              };
            }) : [];
            
            newTopics.push({
              id: Date.now() + Math.random(),
              name: topicFromDb.name,
              topicId: topicFromDb.id,
              hasSubtopics: subtopics.length > 0,
              subtopics: subtopics,
              isCloned: true,
              originalTopicId: clonedInfo.originalId,
              cloneId: topicFromDb.clone_id
            });
          }
        }
        
        setTopics(newTopics);
        saveFormState(bookTitle, currentBookId, newTopics);
      }
      
      await fetchBooks();
      
      setShowCloneTopicModal(false);
      setSelectedSourceBook('');
      setAvailableTopics([]);
      setSelectedTopics([]);
      setTopicTitles({});
      
      alert('Topics cloned successfully!');
    } catch (error) {
      console.error('Error cloning topics:', error);
      alert('Failed to clone topics');
    }
    setLoading(false);
  };

  const handleCloseCloneTopicModal = () => {
    setShowCloneTopicModal(false);
    setSelectedSourceBook('');
    setAvailableTopics([]);
    setSelectedTopics([]);
    setTopicTitles({});
  };

  // Similar handlers for subtopic cloning...
  const handleOpenCloneSubtopicModal = async (topicIndex) => {
    if (!bookTitle.trim()) {
      alert('Please enter a book title first');
      return;
    }

    let bookId = currentBookId;

    if (!bookId) {
      setLoading(true);
      const res = await fetch('/api/author/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: bookTitle })
      });
      
      const data = await res.json();
      if (data.success) {
        bookId = data.bookId;
        setCurrentBookId(bookId);
        saveFormState(bookTitle, bookId, topics);
      } else {
        alert('Error: ' + data.error);
        setLoading(false);
        return;
      }
      setLoading(false);
    }
    
    const topic = topics[topicIndex];
    if (!topic.topicId) {
      alert('Please save the topic first');
      return;
    }
    
    setTargetTopicIndex(topicIndex);
    setLoading(true);
    try {
      const res = await fetch('/api/superadmin/books');
      const data = await res.json();
      if (data.success) {
        setAllBooks(data.data || []);
        setShowCloneSubtopicModal(true);
      } else {
        alert('Failed to load books');
      }
    } catch (error) {
      console.error('Error loading books:', error);
      alert('Failed to load books');
    }
    setLoading(false);
  };

  const handleCloseCloneSubtopicModal = () => {
    setShowCloneSubtopicModal(false);
    setSelectedSourceBookForSubtopic('');
    setAvailableTopicsForSubtopic([]);
    setSelectedSourceTopic('');
    setAvailableSubtopics([]);
    setSelectedSubtopics([]);
    setSubtopicTitles({});
    setTargetTopicIndex(null);
  };

  return {
    // Clone Topic Modal
    showCloneTopicModal,
    allBooks,
    selectedSourceBook,
    availableTopics,
    selectedTopics,
    topicTitles,
    setTopicTitles,
    handleOpenCloneTopicModal,
    handleSourceBookChange,
    handleTopicSelection,
    handleSelectAllTopics,
    handleCloneTopicsSave,
    handleCloseCloneTopicModal,
    
    // Clone Subtopic Modal
    showCloneSubtopicModal,
    handleOpenCloneSubtopicModal,
    handleCloseCloneSubtopicModal,
    selectedSourceBookForSubtopic,
    availableTopicsForSubtopic,
    selectedSourceTopic,
    availableSubtopics,
    selectedSubtopics,
    subtopicTitles,
    setSubtopicTitles,
    
    // Sync Modal
    showSyncModal,
    setShowSyncModal,
    isEditMode,
    setIsEditMode
  };
}
