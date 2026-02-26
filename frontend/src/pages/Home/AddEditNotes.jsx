import React, { useState, useEffect, useRef } from 'react'
import Tag from '../../components/Input/Tag/Tag'
import { MdClose } from 'react-icons/md'
import { BiSolidMicrophone, BiSolidMicrophoneOff } from "react-icons/bi";
import { motion } from 'framer-motion'
import axiosInstance from '../../utils/axiosinstance'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './AddEditNotes.css'

const AddEditNotes = ({ noteData, type, getAllNotes, onClose }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const speechStartContentRef = useRef("");

   const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

     const handleMicToggle = async () => {
  if (!browserSupportsSpeechRecognition) return;

  if (isMicActive) {
    setIsMicActive(false);
    await SpeechRecognition.stopListening();
    SpeechRecognition.abortListening();
    resetTranscript();
  } else {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      speechStartContentRef.current = content;
      resetTranscript();

      setIsMicActive(true);

      SpeechRecognition.startListening({
        continuous: false,
        interimResults: true,
        language: "en-US",
      });

    } catch (err) {
      console.error(err);
    }
  }
};
  useEffect(() => {
  if (isMicActive && !listening) {
    SpeechRecognition.startListening({
      continuous: false,
      interimResults: true,
      language: "en-US",
    });
  }
}, [listening, isMicActive]);

      useEffect(() => {
        if (transcript) {
          setContent(prev => prev + " " + transcript);
        }
      }, [transcript]);

      useEffect(() => {
        document.getElementById("title-input")?.focus();
      }, [])
      useEffect(() => {
        SpeechRecognition.removeAllListeners?.();
      }, []);
      
  const addNewNote = async () => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags
      })
      if(response.data && response.data.note){
        await getAllNotes();
        onClose();
      }
    } catch (error) {
      const msg = error.response.data?.message || "Something went wrong";
      setError(msg);
    }finally{
      setIsSubmitting(false);
    }
  }
  const editNote = async () =>{
    setIsSubmitting(true);
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/edit-note/" +noteId, {
        title,
        content,
        tags
      });
      if(response.data && response.data.note){
        await getAllNotes();
        onClose();
      }
    } catch (error) {
        const msg = error.response?.data?.message || "Something went wrong";
        setError(msg);
    }finally{
      setIsSubmitting(false);
    }
  }
  const handleAddNote = () => {
    if(!title){
      setError("Please enter the title");
      document.getElementById("title-input").focus();
      return;
    }
    if(!content){
      setError("Please enter the content");
      document.getElementById("content-input").focus();
      return;
    }
    setError("");
    if(type === "edit") editNote();
    else addNewNote();
  }
  return (
    <motion.div
    className='notes1-container'
    initial = {{ opacity: 0, y: 20}}
    animate = {{ opacity: 1, y: 0}}
    transition={{ duration: 0.3 }}
    >
      <motion.button
      className='badge-button'
      onClick={onClose}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      >
        <MdClose className='close-btn' />
      </motion.button>
      <div className="notes-7">
        <label className='input-label'>
          TITLE
        </label>
        <motion.input 
          id="title-input"
          type='text'
          className='title_input'
          placeholder='Study Data Structures'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          whileFocus={{scale: 1.01}}
        />
      </div>
      <div className="notes-8">
        <label className='input-label '>
        CONTENT
        </label>
        <motion.textarea
          id="content-input"
          type="text"
          className='content_input' 
          placeholder='Write your note content here...'
          rows={8}
          value={content}
          onChange={({target}) => setContent(target.value)}
          whileFocus={{scale: 1.01}}
        >
        </motion.textarea>
        <button 
        onClick={handleMicToggle} 
        className='mic-handle'
        disabled={!browserSupportsSpeechRecognition}
          style={{
            opacity: browserSupportsSpeechRecognition ? 1 : 0.5,
            cursor: browserSupportsSpeechRecognition ? "pointer" : "not-allowed"
          }}
        >
          {listening ? (<BiSolidMicrophoneOff className='microphone-off'/>) : (<BiSolidMicrophone className='microphone-on'/>)}
        </button>
      </div>
      <div className="notes-10">
        <label className='input-label'>
          Tags
        </label>
        <Tag tags={tags} setTags={setTags}/>
      </div>
      {error && (
        <motion.p
        className='error-para'
        initial={{ opacity: 0, x: -10}}
        animate={{ opacity: 1, x: 0}}
        transition={{ duration: 0.2}}
        >
          {error}
        </motion.p>
      )}
      <motion.button
      className={`btn-primary ${
        isSubmitting ? "btn-primary-1": ""
      }`}
      onClick={handleAddNote}
      disabled={isSubmitting}
      whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? (
          <span className='btn-01'>
            <svg
            className='btn-spinning'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            >
              <circle
               className='circle-01'
               cx="12"
               cy="12"
               r="10"
               stroke="currentColor"
               strokeWidth="4"
              ></circle>
              <path
              className='path-01'
              fill='currentColor'
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {type === "edit" ? "UPDATING..." : "ADDING..."}
          </span>
        ):(
          <span>{type === "edit" ? "UPDATE": "ADD"}</span>
        )}
      </motion.button>
    </motion.div>
  )
}

export default AddEditNotes