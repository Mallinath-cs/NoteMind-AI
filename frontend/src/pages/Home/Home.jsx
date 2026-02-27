import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, scale} from 'framer-motion'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard/NoteCard'
import {MdOutlineNotes} from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosinstance'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import axios from "axios";
import './Home.css'
import Footer from '../../components/Footer/Footer'

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  });
  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false); 
  const [isloading, setIsLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const summarizeAllNotes = async () => {
    setLoading(true); 

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("/api/ai/summarize-all",{
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAiSummary(res.data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({isShown: true, data: noteDetails, type: "edit"});
  }
  const handleAddNote = () => {
    setOpenAddEditModal({ isShown: true, type: "add", data: null });
  };
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if(response.data?.user){
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if(error.response?.status === 401){
        localStorage.clear();
        navigate("/login");
      }
    }
  }
    const getAllNotes = useCallback(async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/get-all-notes");
        setAllNotes(response.data?.notes || []);
      } catch (error) {
        setAllNotes([]);
      } finally {
        setIsLoading(false);
      }
    }, []);
    const deleteNote = async (data) => {
    try {
      const response = await axiosInstance.delete(`/delete-note/${data._id}`);
      if(response.data && !response.data.error){
        getAllNotes();
      }
    } catch (error) {
      console.log("An unexpected error occurred.");
    }
  }
  const onSearchNote = async (query) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/search-notes', {
        params: { query },

      })
      if(response.data?.notes){
        setIsSearch(true);
        setTimeout(() => {
          setAllNotes(response.data.notes);
          setIsLoading(false);
        }, 500);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }
    const updateIsPinned = async (noteData) => {
    try {
      await axiosInstance.put(
        `/update-note-pinned/${noteData._id}`
      );

      await getAllNotes();   // remove condition
    } catch (error) {
      console.log(error);
    }
  };
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  }

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, [getAllNotes]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    }
  }
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12},
    }
  }
  const buttonVariants = {
    rest: {scale: 1},
    hover: {
      scale: 1.1,
      rotate: 90,
      boxShadow: "0px 4px 20px rgba(22, 163, 74, 0.5)",
      transition: { duration: 0.3 }
    },
    tap: {scale: 0.5}
  }
  return (
    <div className='home'>
      <div className="home-1">
      <Navbar  
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}  
        onAddNote={handleAddNote}
      />
      <div className="container">
        <div className="inner">
          <motion.div
            initial={{opacity:0, y:-20}}
            animate={{opacity:1, y:0}}
            transition={{duration: 0.5}}
            className='inner-1'
          >
            <MdOutlineNotes className='notes-icon'/>
            <h1 className='notes-title'>
              My Notes
            </h1>
          </motion.div>
          <div className="gradient-bar"/>
          <div className="ai-summarizer">
            <button onClick={summarizeAllNotes} disabled={loading} className='summarize-btn'>
              {loading ? "Summarizing..." : "Summarize ✨"}
            </button>
            {loading && (
              <section className="dots-container">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </section>
            )}
            {!loading && aiSummary && (
              <div className="ai-summary">
                <h3>AI Summary</h3>
                <p>{aiSummary}</p>
              </div>
            )}
          </div>
        </div>
        {isloading? ( 
          <div className="bruh-1">
            <div className="bruh-2">
              <div className="spinner"/>
              <div className="ping-circle"></div>
            </div>
          </div>
        ) : allNotes.length > 0 ? (
          <motion.div
            className='notes-grid'
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
          >
            <AnimatePresence>
              {allNotes.map((item) => (
                <motion.div
                  key={item._id}
                  variants={cardVariants}
                  exit={{ opacity: 0, y: 20, transition: { duration: 0.2 }}}
                >
                  <NoteCard
                    title={item.title}
                    date={item.createdOn}
                    content={item.content}
                    tags={item.tags}
                    isPinned={item.isPinned} 
                    onEdit = {() => handleEdit(item)}
                    onDelete = {() => deleteNote(item)}
                    onPinNote = {() => updateIsPinned(item)}
                    />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className='card'
          >   
            <EmptyCard
              message={
                isSearch ? "Oops! no notes found matching your search."
                : "Start creating your note! Click the '+' button to jot down your thoughts and ideas. Let's get started"
              }
            />
          </motion.div>
        )}
      </div>
        
        <Modal 
          isOpen={openAddEditModal.isShown}
          onRequestClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null});
          }
          }
          appElement={document.getElementById('root')}
          style={{
            overlay:{
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              backdropFilter: "blur(8px)",
              zIndex: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }
          }}
          contentLabel=''
          className="modal"
        >
          <AddEditNotes
           type={openAddEditModal.type}
           noteData={openAddEditModal.data}
           onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null})}
           getAllNotes={getAllNotes}
          />
        </Modal>
        </div>
        <Footer />
    </div>
  )
}

export default Home
