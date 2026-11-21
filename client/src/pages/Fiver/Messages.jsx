import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../context/AuthContext.jsx";
import FreelancerNavbar from "../Fiver/FreelanceNavbar.jsx";
import socket from "../Fiver/socket.js";
import "../../styles/Messages.css";


const getAvatar = (user) => {
  return user?.avatar?.url || "https://randomuser.me/api/portraits/men/32.jpg";
};

function Messages() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(Context);
const API_URL = import.meta.env.VITE_API_URL;
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(
    conversationId || ""
  );
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [starringLoading, setStarringLoading] = useState(false);

  const bottomRef = useRef(null);

  const getOtherUser = (conversation) => {
    return conversation.participants?.find(
      (participant) => participant._id?.toString() !== user?._id?.toString()
    );
  };

  const isConversationStarred = (conversation) => {
    return conversation?.starredBy?.some((starredUser) => {
      const starredUserId =
        typeof starredUser === "object" ? starredUser._id : starredUser;

      return starredUserId?.toString() === user?._id?.toString();
    });
  };

  const fetchConversations = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/messages/conversations`,
        {
          withCredentials: true,
        }
      );

      setConversations(data.conversations || []);

      if (!activeConversationId && data.conversations?.length > 0) {
        setActiveConversationId(data.conversations[0]._id);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "Failed conversations");
    }
  };

  const fetchMessages = async (id) => {
    if (!id) return;

    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API_URL}/api/v1/messages/conversation/${id}`,
        {
          withCredentials: true,
        }
      );

      setMessages(data.messages || []);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (conversationId) {
      setActiveConversationId(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!activeConversationId) return;

    fetchMessages(activeConversationId);

    socket.emit("joinConversation", activeConversationId);

    return () => {
      socket.emit("leaveConversation", activeConversationId);
    };
  }, [activeConversationId]);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      if (newMessage.conversation === activeConversationId) {
        setMessages((prev) => {
          const exists = prev.some((msg) => msg._id === newMessage._id);
          return exists ? prev : [...prev, newMessage];
        });
      }

      fetchConversations();
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [activeConversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sortedAndFilteredConversations = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();

    return [...conversations]
      .filter((conversation) => {
        const otherUser = getOtherUser(conversation);

        if (!searchValue) return true;

        return otherUser?.name?.toLowerCase().includes(searchValue);
      })
      .sort((a, b) => {
        const aStarred = isConversationStarred(a);
        const bStarred = isConversationStarred(b);

        if (aStarred && !bStarred) return -1;
        if (!aStarred && bStarred) return 1;

        return (
          new Date(b.lastMessageAt || b.updatedAt) -
          new Date(a.lastMessageAt || a.updatedAt)
        );
      });
  }, [conversations, searchTerm, user]);

  const activeConversation = conversations.find(
    (conv) => conv._id === activeConversationId
  );

  const activeUser = activeConversation ? getOtherUser(activeConversation) : null;

  const activeConversationStarred = activeConversation
    ? isConversationStarred(activeConversation)
    : false;

  const goToProfile = (person, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!person?._id) return;

    navigate(`/freelancers/${person._id}`);
  };

  const handleToggleStar = async () => {
    if (!activeConversationId || starringLoading) return;

    try {
      setStarringLoading(true);

      const { data } = await axios.put(
        `${API_URL}/api/v1/messages/conversation/${activeConversationId}/star`,
        {},
        {
          withCredentials: true,
        }
      );

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation._id === activeConversationId
            ? data.conversation
            : conversation
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update starred conversation."
      );
    } finally {
      setStarringLoading(false);
    }
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Maximum 5 files allowed.");
      return;
    }

    setAttachments(files);
  };

  const handleSendMessage = async (e) => {
  e.preventDefault();

  if (!activeConversationId) return;

  if (!messageText.trim() && attachments.length === 0) {
    return;
  }

  const currentText = messageText;
  const currentAttachments = attachments;

  try {
    setMessageText("");
    setAttachments([]);

    const fileInput = document.getElementById("message-attachments");

    if (fileInput) {
      fileInput.value = "";
    }

    const formData = new FormData();

    formData.append("text", currentText);

    currentAttachments.forEach((file) => {
      formData.append("attachments", file);
    });

    await axios.post(
      `${API_URL}/api/v1/messages/send/${activeConversationId}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    fetchConversations();
  } catch (error) {
    setMessageText(currentText);
    setAttachments(currentAttachments);

    alert(error.response?.data?.message || "Failed to send message.");
  }
};

  return (
    <>
      <FreelancerNavbar />

      <div className="messages-page">
        <div className="container-fluid">
          <div className="messages-header">
            <h2>Messages</h2>
            <p>Communicate with your clients and manage conversations.</p>
          </div>

          <div className="messages-layout">
            {/* LEFT SIDEBAR */}
            <div className="conversation-sidebar">
              <div className="conversation-search">
                <input
                  type="text"
                  placeholder="Search by person name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="bi bi-search"></i>
              </div>

              <div className="conversation-list">
                {sortedAndFilteredConversations.length === 0 ? (
                  <div className="empty-conversations">
                    {searchTerm
                      ? "No matching conversations found."
                      : "No conversations yet."}
                  </div>
                ) : (
                  sortedAndFilteredConversations.map((conversation) => {
                    const otherUser = getOtherUser(conversation);
                    const isActive = conversation._id === activeConversationId;
                    const isStarred = isConversationStarred(conversation);

                    return (
                      <button
                        key={conversation._id}
                        className={`conversation-item ${
                          isActive ? "active" : ""
                        } ${isStarred ? "starred" : ""}`}
                        onClick={() =>
                          setActiveConversationId(conversation._id)
                        }
                      >
                        <div className="conversation-avatar-box">
                          <img
                            src={getAvatar(otherUser)}
                            alt={otherUser?.name}
                          />

                          {isStarred && (
                            <span className="conversation-star-dot">
                              <i className="bi bi-star-fill"></i>
                            </span>
                          )}
                        </div>

                        <div className="conversation-info">
                          <div className="conversation-name-row">
                            <h6
                              className="conversation-user-name"
                              onClick={(e) => goToProfile(otherUser, e)}
                            >
                              {otherUser?.name || "User"}
                            </h6>

                            <span>
                              {conversation.lastMessageAt
                                ? new Date(
                                    conversation.lastMessageAt
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : ""}
                            </span>
                          </div>

                          <p>{conversation.lastMessage || "No messages yet"}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT CHAT */}
            <div className="chat-panel">
              {!activeConversationId ? (
                <div className="chat-empty">
                  <i className="bi bi-chat-dots"></i>
                  <h5>Select a conversation</h5>
                  <p>Choose a conversation to start chatting.</p>
                </div>
              ) : (
                <>
                  <div className="chat-header">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={getAvatar(activeUser)}
                        alt={activeUser?.name}
                        className="chat-user-avatar"
                      />

                      <div>
                        <h5
                          className="chat-user-name"
                          onClick={() => goToProfile(activeUser)}
                        >
                          {activeUser?.name || "User"}
                        </h5>
                        <p>{activeUser?.role || "Member"}</p>
                      </div>
                    </div>

                    <div className="chat-actions">
                      <button
                        type="button"
                        className={activeConversationStarred ? "active" : ""}
                        onClick={handleToggleStar}
                        disabled={starringLoading}
                        title={
                          activeConversationStarred
                            ? "Remove from starred"
                            : "Add to starred"
                        }
                      >
                        <i
                          className={`bi ${
                            activeConversationStarred
                              ? "bi-star-fill"
                              : "bi-star"
                          }`}
                        ></i>
                      </button>

                      <button type="button">
                        <i className="bi bi-three-dots"></i>
                      </button>
                    </div>
                  </div>

                  {activeConversation?.gig && (
                    <div className="chat-gig-card">
                      <div>
                        <h6>{activeConversation.gig.title}</h6>
                        <p>
                          From $
                          {activeConversation.gig.packages?.basic?.price || 0}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="chat-messages">
                    {loading ? (
                      <div className="text-center text-muted py-4">
                        Loading messages...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        No messages yet. Start the conversation.
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isMine =
                          message.sender?._id?.toString() ===
                          user?._id?.toString();

                        return (
                          <div
                            className={`message-row ${isMine ? "mine" : ""}`}
                            key={message._id}
                          >
                            <div className="message-bubble">
                              {message.text && <p>{message.text}</p>}

                              {message.attachments?.length > 0 && (
                                <div className="message-attachments">
                                  {message.attachments.map((file, index) => (
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      key={index}
                                    >
                                      {file.fileType?.startsWith("image/") ? (
                                        <img
                                          src={file.url}
                                          alt={file.fileName}
                                        />
                                      ) : (
                                        <span>
                                          <i className="bi bi-file-earmark"></i>
                                          {file.fileName}
                                        </span>
                                      )}
                                    </a>
                                  ))}
                                </div>
                              )}

                              <small>
                                {new Date(message.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </small>
                            </div>
                          </div>
                        );
                      })
                    )}

                    <div ref={bottomRef}></div>
                  </div>

                  {attachments.length > 0 && (
                    <div className="selected-files">
                      {attachments.map((file, index) => (
                        <span key={index}>{file.name}</span>
                      ))}
                    </div>
                  )}

                  <form
                    className="chat-input-area"
                    onSubmit={handleSendMessage}
                  >
                    <label htmlFor="message-attachments">
                      <i className="bi bi-paperclip"></i>
                    </label>

                    <input
                      id="message-attachments"
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleAttachmentChange}
                    />

                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />

                    <button type="submit">
                      <i className="bi bi-send-fill"></i>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Messages;